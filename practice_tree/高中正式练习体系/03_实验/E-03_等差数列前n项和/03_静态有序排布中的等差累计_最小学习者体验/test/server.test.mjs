import assert from 'node:assert/strict';
import test from 'node:test';
import { startPracticeServer } from '../server.mjs';

function cookieFrom(response) {
  return response.headers.get('set-cookie')?.split(';', 1)[0] ?? '';
}

async function jsonRequest(origin, route, {
  method = 'GET',
  cookie = '',
  body,
  requestOrigin = origin,
  hostHeader = ''
} = {}) {
  const headers = {};
  if (cookie) headers.Cookie = cookie;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (requestOrigin) headers.Origin = requestOrigin;
  if (hostHeader) headers.Host = hostHeader;
  const response = await fetch(`${origin}${route}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

test('本地服务只提供白名单资源与逐步 API', async (context) => {
  const running = await startPracticeServer({ port: 0 });
  context.after(() => running.close());

  const page = await fetch(`${running.origin}/`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-security-policy'), /default-src 'self'/);
  assert.equal(page.headers.get('x-frame-options'), 'DENY');
  assert.equal((await page.text()).includes('实验'), false);

  const health = await jsonRequest(running.origin, '/api/health', { requestOrigin: '' });
  assert.deepEqual(health.payload, { status: 'ok', itemCount: 5 });

  const rawData = await fetch(`${running.origin}/02_静态有序排布中的等差累计_最小题目数据.json`);
  assert.equal(rawData.status, 404);

  const traversal = await fetch(`${running.origin}/../02_静态有序排布中的等差累计_最小题目数据.json`);
  assert.equal(traversal.status, 404);

  const reset = await jsonRequest(running.origin, '/api/reset', {
    method: 'POST',
    body: {}
  });
  assert.equal(reset.response.status, 200);
  const setCookie = reset.response.headers.get('set-cookie');
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /SameSite=Strict/);
  const cookie = cookieFrom(reset.response);
  assert.ok(cookie);

  const initialText = JSON.stringify(reset.payload);
  for (const forbidden of ['internal_name', 'diagnostic_routes', 'correct_value', 'source_locks', 'feedback_messages']) {
    assert.equal(initialText.includes(forbidden), false);
  }

  const state = await jsonRequest(running.origin, '/api/state', { cookie, requestOrigin: '' });
  assert.equal(state.response.status, 200);
  assert.deepEqual(state.payload, reset.payload);

  const rejectedOrigin = await jsonRequest(running.origin, '/api/hint', {
    method: 'POST',
    cookie,
    requestOrigin: 'http://example.invalid',
    body: { revision: reset.payload.revision }
  });
  assert.equal(rejectedOrigin.response.status, 403);
  assert.equal(rejectedOrigin.payload.error, 'origin_rejected');

  const missingOrigin = await jsonRequest(running.origin, '/api/hint', {
    method: 'POST',
    cookie,
    requestOrigin: '',
    body: { revision: reset.payload.revision }
  });
  assert.equal(missingOrigin.response.status, 403);
  assert.equal(missingOrigin.payload.error, 'origin_rejected');

  const forgedHost = await jsonRequest(running.origin, '/api/reset', {
    method: 'POST',
    requestOrigin: 'http://example.invalid',
    hostHeader: 'example.invalid',
    body: {}
  });
  assert.equal(forgedHost.response.status, 403);
  assert.equal(forgedHost.payload.error, 'origin_rejected');

  const wrong = await jsonRequest(running.origin, '/api/answer', {
    method: 'POST',
    cookie,
    body: { revision: reset.payload.revision, response: { choice: 'B' } }
  });
  assert.equal(wrong.response.status, 200);
  assert.equal(wrong.payload.feedback.tone, 'retry');
  assert.equal(wrong.payload.feedback.text, '层号只说明位置，不是这一层对总量贡献的徽章数。');
  assert.equal(JSON.stringify(wrong.payload).includes('前 k 层的累计量已经包含多个对象'), false);
  assert.equal(JSON.stringify(wrong.payload).includes('把对象序号当作贡献数量'), false);
});

test('陈旧 revision 被拒绝，浏览器只能继续使用当前状态', async (context) => {
  const running = await startPracticeServer({ port: 0 });
  context.after(() => running.close());

  const reset = await jsonRequest(running.origin, '/api/reset', { method: 'POST', body: {} });
  const cookie = cookieFrom(reset.response);
  const firstHint = await jsonRequest(running.origin, '/api/hint', {
    method: 'POST',
    cookie,
    body: { revision: reset.payload.revision }
  });
  assert.equal(firstHint.response.status, 200);
  assert.equal(firstHint.payload.releasedHints.length, 1);

  const stale = await jsonRequest(running.origin, '/api/hint', {
    method: 'POST',
    cookie,
    body: { revision: reset.payload.revision }
  });
  assert.equal(stale.response.status, 409);
  assert.equal(stale.payload.error, 'state_changed');

  const current = await jsonRequest(running.origin, '/api/state', { cookie, requestOrigin: '' });
  assert.equal(current.payload.revision, firstHint.payload.revision);
  assert.equal(current.payload.releasedHints.length, 1);
});
