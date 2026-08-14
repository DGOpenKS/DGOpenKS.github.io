import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createPracticeEngine, PracticeStateError } from './practice-engine.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(HERE, '../../../../..');
const DATA_PATH = path.resolve(HERE, '..', '02_静态有序排布中的等差累计_最小题目数据.json');
const PUBLIC_DIR = path.join(HERE, 'public');
const COOKIE_NAME = 'dgopenks_practice_session';
const MAX_BODY_BYTES = 16 * 1024;

const STATIC_FILES = new Map([
  ['/', { path: path.join(PUBLIC_DIR, 'index.html'), type: 'text/html; charset=utf-8' }],
  ['/index.html', { path: path.join(PUBLIC_DIR, 'index.html'), type: 'text/html; charset=utf-8' }],
  ['/practice.css', { path: path.join(PUBLIC_DIR, 'practice.css'), type: 'text/css; charset=utf-8' }],
  ['/practice.js', { path: path.join(PUBLIC_DIR, 'practice.js'), type: 'text/javascript; charset=utf-8' }],
  ['/brand/openks-lockup.svg', {
    path: path.join(REPOSITORY_ROOT, 'assets/brand/openks-lockup-a-primary.svg'),
    type: 'image/svg+xml'
  }],
  ['/brand/favicon.svg', {
    path: path.join(REPOSITORY_ROOT, 'assets/brand/favicon.svg'),
    type: 'image/svg+xml'
  }]
]);

const SECURITY_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY'
};

function parseCookies(header = '') {
  const cookies = new Map();
  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (key) cookies.set(key, decodeURIComponent(value));
  }
  return cookies;
}

function sessionIdFromRequest(request) {
  return parseCookies(request.headers.cookie).get(COOKIE_NAME);
}

function sendJson(response, status, value, extraHeaders = {}) {
  const body = JSON.stringify(value);
  response.writeHead(status, {
    ...SECURITY_HEADERS,
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    ...extraHeaders
  });
  response.end(body);
}

function sendText(response, status, text) {
  response.writeHead(status, {
    ...SECURITY_HEADERS,
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(text)
  });
  response.end(text);
}

async function readJsonBody(request) {
  if (!String(request.headers['content-type'] ?? '').toLowerCase().startsWith('application/json')) {
    throw new PracticeStateError(415, 'content_type_required', '请求格式不受支持。');
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      throw new PracticeStateError(413, 'request_too_large', '提交内容过长。');
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new PracticeStateError(400, 'invalid_json', '提交内容无法读取。');
  }
}

function assertSameOrigin(request, expectedOrigin) {
  const origin = request.headers.origin;
  const expectedHost = expectedOrigin ? new URL(expectedOrigin).host : '';
  if (!origin || origin !== expectedOrigin || request.headers.host !== expectedHost) {
    throw new PracticeStateError(403, 'origin_rejected', '请求来源不受允许。');
  }
}

async function serveStatic(response, route) {
  const file = STATIC_FILES.get(route);
  if (!file) return false;
  const body = await readFile(file.path);
  response.writeHead(200, {
    ...SECURITY_HEADERS,
    'Content-Type': file.type,
    'Content-Length': body.length
  });
  response.end(body);
  return true;
}

function stateErrorBody(error) {
  return {
    error: error instanceof PracticeStateError ? error.code : 'request_failed',
    message: error instanceof PracticeStateError ? error.message : '本地服务暂时无法处理该请求。'
  };
}

export async function startPracticeServer({ host = '127.0.0.1', port = 4173 } = {}) {
  if (host !== '127.0.0.1') {
    throw new Error('本地原型只允许绑定 127.0.0.1。');
  }
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('端口必须是 0 到 65535 之间的整数。');
  }

  const data = JSON.parse(await readFile(DATA_PATH, 'utf8'));
  const engine = createPracticeEngine(data);
  let origin = '';

  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1');

      if (request.method === 'GET' && await serveStatic(response, url.pathname)) return;

      if (request.method === 'GET' && url.pathname === '/api/health') {
        sendJson(response, 200, { status: 'ok', itemCount: data.items.length });
        return;
      }

      if (request.method === 'GET' && url.pathname === '/api/state') {
        const sessionId = sessionIdFromRequest(request);
        sendJson(response, 200, engine.getState(sessionId));
        return;
      }

      if (request.method === 'POST' && url.pathname.startsWith('/api/')) {
        assertSameOrigin(request, origin);
        const body = await readJsonBody(request);

        if (url.pathname === '/api/reset') {
          const created = engine.createSession();
          sendJson(response, 200, created.state, {
            'Set-Cookie': `${COOKIE_NAME}=${encodeURIComponent(created.sessionId)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=7200`
          });
          return;
        }

        const sessionId = sessionIdFromRequest(request);
        let state;
        if (url.pathname === '/api/answer') {
          state = engine.answer(sessionId, body.revision, body.response);
        } else if (url.pathname === '/api/hint') {
          state = engine.hint(sessionId, body.revision);
        } else if (url.pathname === '/api/reveal') {
          state = engine.reveal(sessionId, body.revision);
        } else if (url.pathname === '/api/continue') {
          state = engine.continueSession(sessionId, body.revision);
        } else {
          sendText(response, 404, 'Not found');
          return;
        }
        sendJson(response, 200, state);
        return;
      }

      sendText(response, 404, 'Not found');
    } catch (error) {
      const status = error instanceof PracticeStateError ? error.status : 500;
      sendJson(response, status, stateErrorBody(error));
    }
  });

  server.on('clientError', (_error, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });

  const cleanupTimer = setInterval(() => engine.purgeExpired(), 15 * 60 * 1000);
  cleanupTimer.unref();
  const address = server.address();
  origin = `http://${host}:${address.port}`;

  return {
    server,
    engine,
    origin,
    async close() {
      clearInterval(cleanupTimer);
      await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  };
}

function commandLinePort(argv) {
  const index = argv.indexOf('--port');
  if (index < 0) return 4173;
  const port = Number(argv[index + 1]);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('--port 后必须提供 1 到 65535 之间的整数。');
  }
  return port;
}

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  const running = await startPracticeServer({ port: commandLinePort(process.argv.slice(2)) });
  process.stdout.write(`OpenKS 本地练习已启动：${running.origin}/\n`);
}
