import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  createPracticeEngine,
  evaluatePracticeStep,
  PracticeStateError
} from '../practice-engine.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(HERE, '..', '..', '02_静态有序排布中的等差累计_最小题目数据.json');
const data = JSON.parse(await readFile(DATA_PATH, 'utf8'));

function serialized(value) {
  return JSON.stringify(value);
}

function assertNoInternalLeak(value) {
  const text = serialized(value);
  for (const forbidden of [
    'source_locks',
    'correct_value',
    'diagnostic_routes',
    'internal_name',
    'local_item_key',
    'local_step_key',
    'feedback_messages',
    'expected_terminal_gate',
    'item-01'
  ]) {
    assert.equal(text.includes(forbidden), false, `响应不应包含 ${forbidden}`);
  }
}

test('初始状态只投影当前题与当前一步', () => {
  const engine = createPracticeEngine(data);
  const created = engine.createSession();
  const { state } = created;

  assert.equal(state.phase, 'answering');
  assert.deepEqual(state.position, { item: 1, itemCount: 5, step: 1, stepCount: 4 });
  assert.equal(state.stem, data.items[0].learner.stem);
  assert.equal(state.prompt, data.items[0].steps[0].learner.prompt);
  assert.deepEqual(state.choices, data.items[0].steps[0].learner.choices);
  assert.deepEqual(state.releasedHints, []);
  assert.equal(state.completion, undefined);
  assert.equal(serialized(state).includes(data.items[0].learner.completed_explanation), false);
  assert.equal(serialized(state).includes(data.items[0].steps[0].learner.hints[0]), false);
  assertNoInternalLeak(state);
});

test('提示逐层释放，完整解答只在第三层提示后出现并终结当前题', () => {
  const engine = createPracticeEngine(data);
  const { sessionId, state: initial } = engine.createSession();

  assert.throws(
    () => engine.reveal(sessionId, initial.revision),
    (error) => error instanceof PracticeStateError && error.code === 'reveal_locked'
  );

  const first = engine.hint(sessionId, initial.revision);
  assert.deepEqual(first.releasedHints, [data.items[0].steps[0].learner.hints[0]]);
  assert.equal(serialized(first).includes(data.items[0].steps[0].learner.hints[1]), false);

  const second = engine.hint(sessionId, first.revision);
  assert.equal(second.releasedHints.length, 2);
  assert.equal(serialized(second).includes(data.items[0].steps[0].learner.hints[2]), false);

  const third = engine.hint(sessionId, second.revision);
  assert.equal(third.releasedHints.length, 3);
  assert.equal(third.actions.canReveal, true);

  const revealed = engine.reveal(sessionId, third.revision);
  assert.equal(revealed.phase, 'item_complete');
  assert.equal(revealed.completion.heading, '完整解答');
  assert.equal(revealed.completion.explanation, data.items[0].learner.completed_explanation);
  assertNoInternalLeak(revealed);

  const next = engine.continueSession(sessionId, revealed.revision);
  assert.equal(next.position.item, 2);
  assert.equal(next.position.step, 1);
});

test('完整计算接受两种公式与完整逐项相加，并拒绝只有结果或省略项', () => {
  const item = data.items[0];
  const step = item.steps[2];

  const endpointFormula = evaluatePracticeStep(item, step, {
    lastTerm: '91',
    total: '1026',
    work: 'a_18=23+17×4=91；S_18=18×(23+91)÷2=1026'
  });
  assert.equal(endpointFormula.correct, true);

  const equivalentEndpointFormula = evaluatePracticeStep(item, step, {
    lastTerm: '91',
    total: '1026',
    work: '23+4×(18−1)=91；(91+23)×18÷2=1026'
  });
  assert.equal(equivalentEndpointFormula.correct, true);

  const decomposedEndpointFormula = evaluatePracticeStep(item, step, {
    lastTerm: '91',
    total: '1026',
    work: '17×4=68；23+68=91；18÷2=9；9×(23+91)=1026'
  });
  assert.equal(decomposedEndpointFormula.correct, true);

  const averageEndpointFormula = evaluatePracticeStep(item, step, {
    lastTerm: '91',
    total: '1026',
    work: '23+17×4=91；(23+91)÷2=57；18×57=1026'
  });
  assert.equal(averageEndpointFormula.correct, true);

  const decomposedDifferenceFormula = evaluatePracticeStep(item, step, {
    lastTerm: '91',
    total: '1026',
    work: '23+17×4=91；18×23=414；18×17÷2=153；153×4=612；414+612=1026'
  });
  assert.equal(decomposedDifferenceFormula.correct, true);

  const directDecomposedDifferenceFormula = evaluatePracticeStep(item, step, {
    lastTerm: '91',
    total: '1026',
    work: '23+17×4=91；18×23=414；18×17÷2×4=612；414+612=1026'
  });
  assert.equal(directDecomposedDifferenceFormula.correct, true);

  const differenceFormula = evaluatePracticeStep(item, step, {
    lastTerm: '91',
    total: '1026',
    work: '23+17×4=91；18×23+18×17÷2×4=1026'
  });
  assert.equal(differenceFormula.correct, true);

  const directTerms = Array.from({ length: 18 }, (_, index) => 23 + index * 4).join('+');
  const directSum = evaluatePracticeStep(item, step, {
    lastTerm: '91',
    total: '1026',
    work: `${directTerms}=1026`
  });
  assert.equal(directSum.correct, true);

  const partialDirect = evaluatePracticeStep(item, step, {
    lastTerm: '91',
    total: '1026',
    work: '23+27+31+…+91=1026'
  });
  assert.deepEqual(partialDirect, { correct: false, feedbackIndex: 3 });

  const valuesOnly = evaluatePracticeStep(item, step, {
    lastTerm: '91',
    total: '1026',
    work: '末项 91，总量 1026'
  });
  assert.deepEqual(valuesOnly, { correct: false, feedbackIndex: 4 });

  const wrongLastTerm = evaluatePracticeStep(item, step, {
    lastTerm: '95',
    total: '1026',
    work: '23+18×4=95；18×(23+95)÷2=1062'
  });
  assert.deepEqual(wrongLastTerm, { correct: false, feedbackIndex: 1 });

  const numericalCoincidence = evaluatePracticeStep(item, step, {
    lastTerm: '91',
    total: '1026',
    work: '23+17+4+47=91；18+23+91+2+892=1026'
  });
  assert.deepEqual(numericalCoincidence, { correct: false, feedbackIndex: 4 });
});

test('结果含义采用结构字段，合同内检查与首错顺序保持稳定', () => {
  const item01 = data.items[0];
  const step01 = item01.steps[3];
  const item01Base = { scope: '第 1 层到第 18 层', total: '1026', unit: '枚徽章' };

  for (const check of [
    '23+17×4=91',
    '18×23≤1026≤18×91',
    '414≤1026≤1638',
    '1026≥414；1026≤1638'
  ]) {
    assert.equal(evaluatePracticeStep(item01, step01, { ...item01Base, check }).correct, true);
  }

  assert.equal(evaluatePracticeStep(item01, step01, {
    ...item01Base,
    scope: '从最下层到最上层的所有 18 层',
    check: '23+17×4=91'
  }).correct, true);

  assert.deepEqual(evaluatePracticeStep(item01, step01, {
    ...item01Base,
    scope: '前 17 层',
    check: '23+17×4=91'
  }), { correct: false, feedbackIndex: 1 });

  assert.deepEqual(evaluatePracticeStep(item01, step01, {
    ...item01Base,
    total: '1000',
    check: '23+17×4=91'
  }), { correct: false, feedbackIndex: 2 });

  assert.deepEqual(evaluatePracticeStep(item01, step01, {
    ...item01Base,
    unit: '件',
    check: '23+17×4=91'
  }), { correct: false, feedbackIndex: 3 });

  assert.deepEqual(evaluatePracticeStep(item01, step01, {
    ...item01Base,
    check: ''
  }), { correct: false, feedbackIndex: 4 });

  assert.deepEqual(evaluatePracticeStep(item01, step01, {
    ...item01Base,
    check: '23+18×4=95'
  }), { correct: false, feedbackIndex: 5 });

  const item04 = data.items[3];
  const step04 = item04.steps[2];
  const item04Base = { scope: '第一个到最右边的全部 14 个盒', total: '693', unit: '枚纪念章' };
  for (const check of ['7×99=693', '14×99÷2=693', '13×5=65；17+65=82', '238≤693≤1148']) {
    assert.equal(evaluatePracticeStep(item04, step04, { ...item04Base, check }).correct, true);
  }
  assert.deepEqual(evaluatePracticeStep(item04, step04, {
    ...item04Base,
    check: '7+99+587=693'
  }), { correct: false, feedbackIndex: 5 });

  const item05 = data.items[4];
  const step05 = item05.steps[2];
  const item05Base = { scope: '全部 24 层', total: '1008', unit: '枚贝壳标本' };
  for (const check of ['42+23×0=42', '23×0=0；42+0=42', '24×42=1008']) {
    assert.equal(evaluatePracticeStep(item05, step05, { ...item05Base, check }).correct, true);
  }
});

test('五题十三步可以完整走通，两个停止题保持成功终态', () => {
  const engine = createPracticeEngine(data);
  const created = engine.createSession();
  const sessionId = created.sessionId;
  let state = created.state;

  function answer(response) {
    state = engine.answer(sessionId, state.revision, response);
    return state;
  }

  function next() {
    state = engine.continueSession(sessionId, state.revision);
    return state;
  }

  answer({ choice: 'A' });
  next();
  answer({ answer: '17' });
  next();
  answer({
    lastTerm: '91',
    total: '1026',
    work: '23+17×4=91；18×(23+91)÷2=1026'
  });
  next();
  answer({ scope: '全部 18 层', total: '1026', unit: '枚徽章', check: '23+17×4=91' });
  assert.equal(state.phase, 'item_complete');
  assert.equal(state.completion.heading, '完成后的方法回看');
  assert.equal(state.completion.explanation, data.items[0].learner.completed_explanation);

  next();
  answer({ choice: 'B' });
  assert.equal(state.completion.heading, '条件不满足，正确停止');
  assert.equal(state.completion.explanation, data.items[1].learner.completed_explanation);
  assert.equal(serialized(state).includes('480'), false);

  next();
  answer({ choice: 'C' });
  next();
  answer({ choice: 'B' });
  assert.equal(state.completion.heading, '条件不满足，正确停止');
  assert.equal(state.completion.explanation.includes('42N'), true);
  assert.equal(state.completion.explanation, data.items[2].learner.completed_explanation);

  next();
  answer({ answer: '14' });
  next();
  answer({ answer: '693' });
  next();
  answer({
    scope: '第一个到最右边的全部 14 个盒',
    total: '693',
    unit: '枚纪念章',
    check: '17+13×5=82'
  });
  assert.equal(state.completion.explanation, data.items[3].learner.completed_explanation);

  next();
  answer({ choice: 'A' });
  next();
  answer({ answer: '1008' });
  next();
  answer({ scope: '全部 24 层', total: '1008', unit: '枚贝壳标本', check: '24×42=1008' });
  assert.equal(state.phase, 'item_complete');
  assert.equal(state.completion.explanation, data.items[4].learner.completed_explanation);

  next();
  assert.equal(state.phase, 'finished');
  assert.equal(state.message, '已完成本次体验。');
  assertNoInternalLeak(state);
});
