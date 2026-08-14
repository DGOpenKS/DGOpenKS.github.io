import { randomUUID } from 'node:crypto';

const SESSION_TTL_MS = 2 * 60 * 60 * 1000;

const RESPONSE_KIND = {
  single_choice: 'choice',
  integer: 'number',
  compound: 'calculation',
  semantic_rubric: 'explanation_check'
};

export class PracticeStateError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = 'PracticeStateError';
    this.status = status;
    this.code = code;
  }
}

function assertPracticeData(data) {
  if (data?.format !== 'dgopenks_local_practice_experiment' || data?.format_version !== 1) {
    throw new Error('题目数据格式不受支持。');
  }
  if (!Array.isArray(data.items) || data.items.length !== 5) {
    throw new Error('题目数据必须包含五段材料。');
  }
  for (const item of data.items) {
    if (!item?.learner?.stem || !item?.learner?.completed_explanation || !Array.isArray(item.steps)) {
      throw new Error('题目数据缺少学习者字段。');
    }
    for (const step of item.steps) {
      const type = step?.internal?.response_contract?.type;
      if (!RESPONSE_KIND[type] || !step?.learner?.prompt || !Array.isArray(step?.learner?.hints)) {
        throw new Error('题目步骤合同不完整。');
      }
      if (step.learner.hints.length !== 3 || !Array.isArray(step?.learner?.feedback_messages)) {
        throw new Error('题目步骤必须包含三层提示和反馈。');
      }
    }
  }
}

function parseInteger(value) {
  const text = String(value ?? '').trim();
  if (!/^-?\d+$/.test(text)) return null;
  const number = Number(text);
  return Number.isSafeInteger(number) ? number : null;
}

function normalizeMathText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/\\(?:times|cdot)/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\leq(?:slant)?/g, '<=')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/[−–—]/g, '-')
    .replace(/[≤≦]/g, '<=')
    .replace(/[≥≧]/g, '>=')
    .replace(/[{}$]/g, '')
    .replace(/[a-zA-Z]+_?\d+/g, '')
    .replace(/\s+/g, '');
}

function prepareExpression(value) {
  return value
    .replace(/(\d|\))\(/g, '$1*(')
    .replace(/\)(?=\d)/g, ')*');
}

function evaluateNumericExpression(value) {
  const source = prepareExpression(value);
  if (!source || !/^[0-9+\-*/().]+$/.test(source)) return null;

  const tokens = source.match(/\d+(?:\.\d+)?|[()+\-*/]/g) ?? [];
  if (tokens.join('') !== source) return null;

  let cursor = 0;

  function parsePrimary() {
    const token = tokens[cursor];
    if (token === '+' || token === '-') {
      cursor += 1;
      const value = parsePrimary();
      return value === null ? null : token === '-' ? -value : value;
    }
    if (token === '(') {
      cursor += 1;
      const value = parseAdditive();
      if (tokens[cursor] !== ')') return null;
      cursor += 1;
      return value;
    }
    if (token && /^\d/.test(token)) {
      cursor += 1;
      return Number(token);
    }
    return null;
  }

  function parseMultiplicative() {
    let value = parsePrimary();
    if (value === null) return null;
    while (tokens[cursor] === '*' || tokens[cursor] === '/') {
      const operator = tokens[cursor];
      cursor += 1;
      const right = parsePrimary();
      if (right === null || (operator === '/' && right === 0)) return null;
      value = operator === '*' ? value * right : value / right;
    }
    return value;
  }

  function parseAdditive() {
    let value = parseMultiplicative();
    if (value === null) return null;
    while (tokens[cursor] === '+' || tokens[cursor] === '-') {
      const operator = tokens[cursor];
      cursor += 1;
      const right = parseMultiplicative();
      if (right === null) return null;
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  }

  const result = parseAdditive();
  if (result === null || cursor !== tokens.length || !Number.isFinite(result)) return null;
  return result;
}

function extractNumbers(value) {
  return (String(value).match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
}

function parseExpressionAst(value) {
  const source = prepareExpression(value);
  if (!source || !/^[0-9+\-*/().]+$/.test(source)) return null;

  const tokens = source.match(/\d+(?:\.\d+)?|[()+\-*/]/g) ?? [];
  if (tokens.join('') !== source) return null;

  let cursor = 0;

  function parsePrimary() {
    const token = tokens[cursor];
    if (token === '+' || token === '-') {
      cursor += 1;
      const child = parsePrimary();
      return child ? { type: 'unary', operator: token, child } : null;
    }
    if (token === '(') {
      cursor += 1;
      const node = parseAdditive();
      if (tokens[cursor] !== ')') return null;
      cursor += 1;
      return node;
    }
    if (token && /^\d/.test(token)) {
      cursor += 1;
      return { type: 'number', value: Number(token) };
    }
    return null;
  }

  function parseMultiplicative() {
    let node = parsePrimary();
    if (!node) return null;
    while (tokens[cursor] === '*' || tokens[cursor] === '/') {
      const operator = tokens[cursor];
      cursor += 1;
      const right = parsePrimary();
      if (!right) return null;
      node = { type: 'binary', operator, left: node, right };
    }
    return node;
  }

  function parseAdditive() {
    let node = parseMultiplicative();
    if (!node) return null;
    while (tokens[cursor] === '+' || tokens[cursor] === '-') {
      const operator = tokens[cursor];
      cursor += 1;
      const right = parseMultiplicative();
      if (!right) return null;
      node = { type: 'binary', operator, left: node, right };
    }
    return node;
  }

  const ast = parseAdditive();
  return ast && cursor === tokens.length ? ast : null;
}

function numberNodeMatches(node, expected) {
  return node?.type === 'number' && Math.abs(node.value - expected) < 1e-9;
}

function flattenBinary(node, operator, result = []) {
  if (node?.type === 'binary' && node.operator === operator) {
    flattenBinary(node.left, operator, result);
    flattenBinary(node.right, operator, result);
  } else {
    result.push(node);
  }
  return result;
}

function unorderedNodesMatch(nodes, matchers) {
  if (nodes.length !== matchers.length) return false;
  const used = new Set();

  function visit(index) {
    if (index === matchers.length) return true;
    for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex += 1) {
      if (used.has(nodeIndex) || !matchers[index](nodes[nodeIndex])) continue;
      used.add(nodeIndex);
      if (visit(index + 1)) return true;
      used.delete(nodeIndex);
    }
    return false;
  }

  return visit(0);
}

function sumMatches(node, matchers) {
  return unorderedNodesMatch(flattenBinary(node, '+'), matchers);
}

function collectProductRatio(node, inverted = false, numerator = [], denominator = []) {
  if (node?.type === 'binary' && node.operator === '*') {
    collectProductRatio(node.left, inverted, numerator, denominator);
    collectProductRatio(node.right, inverted, numerator, denominator);
  } else if (node?.type === 'binary' && node.operator === '/') {
    collectProductRatio(node.left, inverted, numerator, denominator);
    collectProductRatio(node.right, !inverted, numerator, denominator);
  } else {
    (inverted ? denominator : numerator).push(node);
  }
  return { numerator, denominator };
}

function productRatioMatches(node, numeratorMatchers, denominatorMatchers = []) {
  const factors = collectProductRatio(node);
  return unorderedNodesMatch(factors.numerator, numeratorMatchers) &&
    unorderedNodesMatch(factors.denominator, denominatorMatchers);
}

function intervalCountMatches(node, count) {
  return numberNodeMatches(node, count) ||
    (node?.type === 'binary' &&
      node.operator === '-' &&
      numberNodeMatches(node.left, count + 1) &&
      numberNodeMatches(node.right, 1));
}

const numberMatcher = (expected) => (node) => numberNodeMatches(node, expected);
const intervalMatcher = (count) => (node) => intervalCountMatches(node, count);
const sumMatcher = (...matchers) => (node) => sumMatches(node, matchers);
const productMatcher = (numerators, denominators = []) =>
  (node) => productRatioMatches(node, numerators, denominators);

function contractExpressionMatches(node, expectedExpression) {
  const expected = normalizeMathText(expectedExpression);
  const n = numberMatcher;
  const interval = intervalMatcher;
  const product = productMatcher;

  if (expected === '23+17*4') {
    return sumMatches(node, [n(23), product([interval(17), n(4)])]);
  }
  if (expected === '18*(23+91)/2') {
    return productRatioMatches(node, [n(18), sumMatcher(n(23), n(91))], [n(2)]);
  }
  if (expected === '18*23+18*17/2*4') {
    return sumMatches(node, [
      product([n(18), n(23)]),
      product([n(18), interval(17), n(4)], [n(2)])
    ]);
  }
  if (expected === '17+13*5') {
    return sumMatches(node, [n(17), product([interval(13), n(5)])]);
  }
  if (expected === '7*99') {
    return productRatioMatches(node, [n(7), n(99)]) ||
      productRatioMatches(node, [n(14), n(99)], [n(2)]);
  }
  if (expected === '42+23*0') {
    return sumMatches(node, [n(42), product([interval(23), n(0)])]);
  }

  const simpleProducts = new Map([
    ['18*23', [18, 23]],
    ['18*91', [18, 91]],
    ['14*17', [14, 17]],
    ['14*82', [14, 82]],
    ['24*42', [24, 42]]
  ]);
  const factors = simpleProducts.get(expected);
  return Boolean(factors) && productRatioMatches(node, factors.map(n));
}

function equalityChains(value) {
  const normalized = normalizeMathText(value);
  const candidates = normalized.match(/[0-9+\-*/().=]+/g) ?? [];
  const chains = [];

  for (const candidate of candidates) {
    if (!candidate.includes('=')) continue;
    const expressions = candidate.split('=').filter(Boolean);
    if (expressions.length < 2) continue;
    const asts = expressions.map(parseExpressionAst);
    if (asts.some((entry) => entry === null)) continue;
    const values = expressions.map(evaluateNumericExpression);
    if (values.some((entry) => entry === null)) continue;
    if (!values.every((entry) => Math.abs(entry - values[0]) < 1e-9)) continue;
    chains.push({ value: values[0], asts });
  }

  return chains;
}

function directEquationMatchesRelation(value, relation) {
  const expectedValue = Number(relation.right_value);
  return equalityChains(value).some((chain) =>
    Math.abs(chain.value - expectedValue) < 1e-9 &&
    chain.asts.some((ast) => contractExpressionMatches(ast, relation.left_expression)) &&
    chain.asts.some((ast) => numberNodeMatches(ast, expectedValue))
  );
}

function chainShows(chains, expectedValue, expressionMatcher) {
  return chains.some((chain) =>
    Math.abs(chain.value - expectedValue) < 1e-9 &&
    chain.asts.some(expressionMatcher) &&
    chain.asts.some((ast) => numberNodeMatches(ast, expectedValue))
  );
}

function equationMatchesRelation(value, relation) {
  if (directEquationMatchesRelation(value, relation)) return true;

  const expected = normalizeMathText(relation.left_expression);
  const chains = equalityChains(value);
  const n = numberMatcher;
  const interval = intervalMatcher;
  const product = productMatcher;
  const shows = (result, matcher) => chainShows(chains, result, matcher);

  if (expected === '23+17*4') {
    return shows(68, product([interval(17), n(4)])) &&
      shows(91, sumMatcher(n(23), n(68)));
  }

  if (expected === '18*(23+91)/2') {
    const endpointSum = sumMatcher(n(23), n(91));
    const halfCount = shows(9, product([n(18)], [n(2)]));
    const summedEndpoints = shows(114, endpointSum);
    const average = shows(57, product([endpointSum], [n(2)])) ||
      (summedEndpoints && shows(57, product([n(114)], [n(2)])));
    const doubledSum = summedEndpoints && shows(2052, product([n(18), n(114)]));

    return (halfCount && shows(1026, product([n(9), endpointSum]))) ||
      (summedEndpoints && shows(1026, product([n(18), n(114)], [n(2)]))) ||
      (halfCount && summedEndpoints && shows(1026, product([n(9), n(114)]))) ||
      (average && shows(1026, product([n(18), n(57)]))) ||
      (doubledSum && shows(1026, product([n(2052)], [n(2)])));
  }

  if (expected === '18*23+18*17/2*4') {
    const base = shows(414, product([n(18), n(23)]));
    const triangularCount = shows(153, product([n(18), interval(17)], [n(2)]));
    const increase = shows(612, product([n(18), interval(17), n(4)], [n(2)])) ||
      (triangularCount && shows(612, product([n(153), n(4)])));
    return base && increase && shows(1026, sumMatcher(n(414), n(612)));
  }

  if (expected === '17+13*5') {
    return shows(65, product([interval(13), n(5)])) &&
      shows(82, sumMatcher(n(17), n(65)));
  }

  if (expected === '42+23*0') {
    return shows(0, product([interval(23), n(0)])) &&
      shows(42, sumMatcher(n(42), n(0)));
  }

  return false;
}

function inequalityMatches(value, predicate) {
  const normalized = normalizeMathText(value);
  const candidates = normalized.match(/[0-9+\-*/().<=>]+/g) ?? [];
  const lowerValue = evaluateNumericExpression(normalizeMathText(predicate.lower_expression));
  const upperValue = evaluateNumericExpression(normalizeMathText(predicate.upper_expression));
  const boundMatches = (ast, expression, evaluatedValue) =>
    contractExpressionMatches(ast, expression) || numberNodeMatches(ast, evaluatedValue);

  const chainMatches = candidates.some((candidate) => {
    if (!candidate.includes('<=')) return false;
    const expressions = candidate.split('<=').filter(Boolean);
    if (expressions.length !== 3) return false;
    const asts = expressions.map(parseExpressionAst);
    if (asts.some((entry) => entry === null)) return false;
    const values = expressions.map(evaluateNumericExpression);
    if (values.some((entry) => entry === null)) return false;
    const relationHolds = values.every((entry, index) => index === 0 || values[index - 1] <= entry + 1e-9);
    const lowerMatches = boundMatches(asts[0], predicate.lower_expression, lowerValue);
    const upperMatches = boundMatches(asts[2], predicate.upper_expression, upperValue);
    return relationHolds && lowerMatches &&
      numberNodeMatches(asts[1], Number(predicate.checked_value)) &&
      upperMatches;
  });
  if (chainMatches) return true;

  let lowerConfirmed = false;
  let upperConfirmed = false;
  const checkedValue = Number(predicate.checked_value);
  for (const candidate of candidates) {
    const operator = candidate.includes('<=') ? '<=' : candidate.includes('>=') ? '>=' : '';
    if (!operator) continue;
    const expressions = candidate.split(operator).filter(Boolean);
    if (expressions.length !== 2) continue;
    const asts = expressions.map(parseExpressionAst);
    const values = expressions.map(evaluateNumericExpression);
    if (asts.some((entry) => entry === null) || values.some((entry) => entry === null)) continue;
    const relationHolds = operator === '<=' ? values[0] <= values[1] + 1e-9 : values[0] + 1e-9 >= values[1];
    if (!relationHolds) continue;

    if (
      (operator === '<=' && boundMatches(asts[0], predicate.lower_expression, lowerValue) && numberNodeMatches(asts[1], checkedValue)) ||
      (operator === '>=' && numberNodeMatches(asts[0], checkedValue) && boundMatches(asts[1], predicate.lower_expression, lowerValue))
    ) lowerConfirmed = true;

    if (
      (operator === '<=' && numberNodeMatches(asts[0], checkedValue) && boundMatches(asts[1], predicate.upper_expression, upperValue)) ||
      (operator === '>=' && boundMatches(asts[0], predicate.upper_expression, upperValue) && numberNodeMatches(asts[1], checkedValue))
    ) upperConfirmed = true;
  }
  return lowerConfirmed && upperConfirmed;
}

function acceptedCheckMatches(step, checkText) {
  const checks = step.internal.response_contract.accepted_checks ?? [];
  return checks.some((check) => {
    if (check.relation) {
      return equationMatchesRelation(checkText, check.relation);
    }
    if (check.predicate) return inequalityMatches(checkText, check.predicate);
    return false;
  });
}

function diagnosticFeedbackIndex(step, predicate) {
  const route = step.internal.diagnostic_routes.find((entry) => predicate(entry.when));
  if (!route) throw new Error('当前错误没有对应的反馈路线。');
  return route.feedback_index;
}

function evaluateChoice(step, response) {
  const value = String(response?.choice ?? '').trim().toUpperCase();
  const choices = step.learner.choices ?? [];
  if (!choices.some((choice) => choice.value === value)) {
    throw new PracticeStateError(400, 'invalid_response', '请选择一个有效选项。');
  }

  if (value === step.internal.response_contract.correct_value) {
    return { correct: true, feedbackIndex: step.internal.correct_feedback_index };
  }

  const feedbackIndex = diagnosticFeedbackIndex(step, (condition) =>
    condition.equals === value || condition.fallback === true
  );
  return { correct: false, feedbackIndex };
}

function evaluateInteger(step, response) {
  const value = parseInteger(response?.answer);
  const expected = step.internal.response_contract.correct_value;
  if (value === expected) {
    return { correct: true, feedbackIndex: step.internal.correct_feedback_index };
  }

  const feedbackIndex = diagnosticFeedbackIndex(step, (condition) =>
    (Object.hasOwn(condition, 'equals') && condition.equals === value) || condition.fallback === true
  );
  return { correct: false, feedbackIndex };
}

function evaluateCalculation(step, response) {
  const contract = step.internal.response_contract;
  const lastTerm = parseInteger(response?.lastTerm);
  const total = parseInteger(response?.total);
  const work = String(response?.work ?? '');

  if (lastTerm !== contract.required_outputs.last_term) {
    const feedbackIndex = diagnosticFeedbackIndex(step, (condition) =>
      condition.field_missing_or_incorrect?.field === 'last_term'
    );
    return { correct: false, feedbackIndex };
  }

  if (total !== contract.required_outputs.total) {
    const feedbackIndex = diagnosticFeedbackIndex(step, (condition) =>
      condition.field_missing_or_incorrect?.field === 'total'
    );
    return { correct: false, feedbackIndex };
  }

  const calculationContracts = contract.accepted_calculation_contracts ?? [];
  const formulaContractSatisfied = calculationContracts
    .filter((entry) => Array.isArray(entry.required_equations))
    .some((entry) => entry.required_equations.every((relation) => equationMatchesRelation(work, relation)));
  const directContract = calculationContracts.find((entry) => entry.kind === 'direct_sum');
  const sequenceRule = directContract?.required_sequence;
  const sequence = sequenceRule
    ? Array.from(
      { length: sequenceRule.term_count },
      (_, index) => sequenceRule.first_term + index * sequenceRule.common_difference
    )
    : [];
  const completeDirectSum = equalityChains(work).some((chain) => {
    if (Math.abs(chain.value - Number(directContract?.required_total)) >= 1e-9) return false;
    const hasTotal = chain.asts.some((ast) => numberNodeMatches(ast, Number(directContract?.required_total)));
    const hasSequence = chain.asts.some((ast) => {
      const terms = flattenBinary(ast, '+');
      return terms.length === sequence.length && unorderedNodesMatch(terms, sequence.map(numberMatcher));
    });
    return hasTotal && hasSequence;
  });

  if (formulaContractSatisfied || completeDirectSum) {
    return { correct: true, feedbackIndex: step.internal.correct_feedback_index };
  }

  const normalized = normalizeMathText(work);
  const workNumbers = extractNumbers(normalized);
  const looksLikeDirectSum =
    (normalized.includes('23+27+31') || sequence.filter((number) => workNumbers.includes(number)).length >= 5) &&
    !completeDirectSum;

  if (looksLikeDirectSum) {
    const feedbackIndex = diagnosticFeedbackIndex(step, (condition) =>
      condition.calculation_kind_detected === 'direct_sum' && condition.complete_work_missing === true
    );
    return { correct: false, feedbackIndex };
  }

  const feedbackIndex = diagnosticFeedbackIndex(step, (condition) =>
    condition.accepted_calculation_contract_missing === true
  );
  return { correct: false, feedbackIndex };
}

function normalizeMeaningField(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/\s+/g, '')
    .replace(/[，。；！？,;!?]/g, '');
}

function semanticScopeFieldMatches(itemKey, value) {
  const scope = normalizeMeaningField(value);
  const patterns = {
    'item-01': [
      /^(?:全部|所有)18层$/,
      /^(?:从)?第1层(?:到|至)第18层$/,
      /^(?:从)?最下层(?:到|至)最上层的?(?:(?:全部|所有)18层)?$/,
      /^整面墙(?:的)?18层$/
    ],
    'item-04': [
      /^(?:全部|所有)14个?盒$/,
      /^(?:从)?第一个(?:到|至)最右边的?(?:(?:全部|所有)14个?盒)?$/,
      /^(?:从)?第1个盒(?:到|至)第14个盒$/
    ],
    'item-05': [
      /^(?:全部|所有)24层$/,
      /^(?:从)?第1层(?:到|至)第24层$/,
      /^(?:从)?最下层(?:到|至)最上层的?(?:(?:全部|所有)24层)?$/
    ]
  };
  return (patterns[itemKey] ?? []).some((pattern) => pattern.test(scope));
}

function semanticUnitFieldMatches(step, value) {
  const unitMeaning = step.internal.response_contract.required_meanings
    .find((meaning) => meaning.key === 'unit');
  const unit = normalizeMeaningField(value);
  return (unitMeaning?.accepted_text ?? [])
    .some((accepted) => normalizeMeaningField(accepted) === unit);
}

function evaluateSemantic(item, step, response) {
  const scope = String(response?.scope ?? '');
  const total = parseInteger(response?.total);
  const unit = String(response?.unit ?? '');
  const check = String(response?.check ?? '');
  const itemKey = item.internal.local_item_key;
  const totalMeaning = step.internal.response_contract.required_meanings.find((meaning) => meaning.key === 'total');

  if (!semanticScopeFieldMatches(itemKey, scope)) {
    const feedbackIndex = diagnosticFeedbackIndex(step, (condition) =>
      condition.required_meaning_missing_or_incorrect === 'scope'
    );
    return { correct: false, feedbackIndex };
  }

  if (total !== Number(totalMeaning.expected_number)) {
    const feedbackIndex = diagnosticFeedbackIndex(step, (condition) =>
      condition.required_meaning_missing_or_incorrect === 'total'
    );
    return { correct: false, feedbackIndex };
  }

  if (!semanticUnitFieldMatches(step, unit)) {
    const feedbackIndex = diagnosticFeedbackIndex(step, (condition) =>
      condition.required_meaning_missing_or_incorrect === 'unit'
    );
    return { correct: false, feedbackIndex };
  }

  if (!check.trim()) {
    const feedbackIndex = diagnosticFeedbackIndex(step, (condition) => condition.check_missing === true);
    return { correct: false, feedbackIndex };
  }

  if (!acceptedCheckMatches(step, check)) {
    const feedbackIndex = diagnosticFeedbackIndex(step, (condition) => condition.check_incorrect === true);
    return { correct: false, feedbackIndex };
  }

  return { correct: true, feedbackIndex: step.internal.correct_feedback_index };
}

export function evaluatePracticeStep(item, step, response) {
  const type = step.internal.response_contract.type;
  if (type === 'single_choice') return evaluateChoice(step, response);
  if (type === 'integer') return evaluateInteger(step, response);
  if (type === 'compound') return evaluateCalculation(step, response);
  if (type === 'semantic_rubric') return evaluateSemantic(item, step, response);
  throw new Error(`不支持的作答合同：${type}`);
}

function terminalHeading(item, outcomeKind) {
  if (outcomeKind === 'answer_revealed') return '完整解答';
  if (item.internal.terminal_kind === 'correct_stop') return '条件不满足，正确停止';
  return '完成后的方法回看';
}

function publicPhase(phase) {
  if (phase === 'step_passed') return 'ready_for_next';
  if (phase === 'item_terminal') return 'item_complete';
  return phase;
}

export function createPracticeEngine(data, { now = () => Date.now() } = {}) {
  assertPracticeData(data);
  const sessions = new Map();

  function createSessionRecord() {
    return {
      id: randomUUID(),
      itemIndex: 0,
      stepIndex: 0,
      phase: 'answering',
      revision: 1,
      hintCount: 0,
      usedHelpInItem: false,
      feedback: null,
      outcomeKind: null,
      touchedAt: now()
    };
  }

  function requireSession(sessionId) {
    const session = sessions.get(sessionId);
    if (!session || now() - session.touchedAt > SESSION_TTL_MS) {
      if (session) sessions.delete(sessionId);
      throw new PracticeStateError(401, 'session_missing', '当前练习已结束，请重新开始。');
    }
    session.touchedAt = now();
    return session;
  }

  function requireRevision(session, revision) {
    if (!Number.isInteger(revision) || revision !== session.revision) {
      throw new PracticeStateError(409, 'state_changed', '页面状态已经变化，请使用当前步骤继续。');
    }
  }

  function currentItem(session) {
    return data.items[session.itemIndex];
  }

  function currentStep(session) {
    return currentItem(session)?.steps[session.stepIndex];
  }

  function stateFor(session) {
    if (session.phase === 'finished') {
      return {
        revision: session.revision,
        phase: 'finished',
        position: { item: data.items.length, itemCount: data.items.length },
        message: '已完成本次体验。',
        actions: { canReset: true }
      };
    }

    const item = currentItem(session);
    const step = currentStep(session);
    const responseType = step.internal.response_contract.type;
    const result = {
      revision: session.revision,
      phase: publicPhase(session.phase),
      position: {
        item: session.itemIndex + 1,
        itemCount: data.items.length,
        step: session.stepIndex + 1,
        stepCount: item.steps.length
      },
      stem: item.learner.stem,
      prompt: step.learner.prompt,
      responseKind: RESPONSE_KIND[responseType],
      releasedHints: step.learner.hints.slice(0, session.hintCount),
      feedback: session.feedback,
      actions: {
        canSubmit: session.phase === 'answering',
        canHint: session.phase === 'answering' && session.hintCount < step.learner.hints.length,
        canReveal: session.phase === 'answering' && session.hintCount === step.learner.hints.length,
        canContinue: session.phase === 'step_passed' || session.phase === 'item_terminal',
        canReset: false
      }
    };

    if (Array.isArray(step.learner.choices)) {
      result.choices = step.learner.choices.map(({ value, text }) => ({ value, text }));
    }

    if (session.phase === 'item_terminal') {
      result.completion = {
        heading: terminalHeading(item, session.outcomeKind),
        explanation: item.learner.completed_explanation
      };
    }

    return result;
  }

  function createSession() {
    const session = createSessionRecord();
    sessions.set(session.id, session);
    return { sessionId: session.id, state: stateFor(session) };
  }

  function getState(sessionId) {
    return stateFor(requireSession(sessionId));
  }

  function answer(sessionId, revision, response) {
    const session = requireSession(sessionId);
    requireRevision(session, revision);
    if (session.phase !== 'answering') {
      throw new PracticeStateError(409, 'invalid_phase', '当前步骤已经结束，请继续下一步。');
    }

    const item = currentItem(session);
    const step = currentStep(session);
    const evaluation = evaluatePracticeStep(item, step, response ?? {});
    const feedbackText = step.learner.feedback_messages[evaluation.feedbackIndex];

    if (!evaluation.correct) {
      session.usedHelpInItem = true;
      session.feedback = { tone: 'retry', text: feedbackText };
      session.revision += 1;
      return stateFor(session);
    }

    session.feedback = { tone: 'correct', text: feedbackText };
    const isLastStep = session.stepIndex === item.steps.length - 1;
    if (isLastStep) {
      session.phase = 'item_terminal';
      session.outcomeKind = item.internal.terminal_kind === 'correct_stop'
        ? 'correct_stop'
        : session.usedHelpInItem
          ? 'hinted_complete'
          : 'independent_complete';
    } else {
      session.phase = 'step_passed';
    }
    session.revision += 1;
    return stateFor(session);
  }

  function hint(sessionId, revision) {
    const session = requireSession(sessionId);
    requireRevision(session, revision);
    if (session.phase !== 'answering') {
      throw new PracticeStateError(409, 'invalid_phase', '当前步骤已经结束，不能继续查看提示。');
    }
    const step = currentStep(session);
    if (session.hintCount >= step.learner.hints.length) {
      throw new PracticeStateError(409, 'hints_exhausted', '三层提示已经全部显示。');
    }

    session.hintCount += 1;
    session.usedHelpInItem = true;
    session.feedback = null;
    session.revision += 1;
    return stateFor(session);
  }

  function reveal(sessionId, revision) {
    const session = requireSession(sessionId);
    requireRevision(session, revision);
    if (session.phase !== 'answering') {
      throw new PracticeStateError(409, 'invalid_phase', '当前步骤已经结束。');
    }
    const step = currentStep(session);
    if (session.hintCount !== step.learner.hints.length) {
      throw new PracticeStateError(409, 'reveal_locked', '请先依次查看三层提示。');
    }

    session.phase = 'item_terminal';
    session.usedHelpInItem = true;
    session.outcomeKind = 'answer_revealed';
    session.feedback = null;
    session.revision += 1;
    return stateFor(session);
  }

  function continueSession(sessionId, revision) {
    const session = requireSession(sessionId);
    requireRevision(session, revision);

    if (session.phase === 'step_passed') {
      session.stepIndex += 1;
      session.phase = 'answering';
      session.hintCount = 0;
      session.feedback = null;
      session.revision += 1;
      return stateFor(session);
    }

    if (session.phase === 'item_terminal') {
      if (session.itemIndex === data.items.length - 1) {
        session.phase = 'finished';
      } else {
        session.itemIndex += 1;
        session.stepIndex = 0;
        session.phase = 'answering';
        session.hintCount = 0;
        session.usedHelpInItem = false;
        session.feedback = null;
        session.outcomeKind = null;
      }
      session.revision += 1;
      return stateFor(session);
    }

    throw new PracticeStateError(409, 'invalid_phase', '请先完成当前步骤。');
  }

  function purgeExpired() {
    const cutoff = now() - SESSION_TTL_MS;
    for (const [sessionId, session] of sessions) {
      if (session.touchedAt < cutoff) sessions.delete(sessionId);
    }
  }

  return {
    createSession,
    getState,
    answer,
    hint,
    reveal,
    continueSession,
    purgeExpired
  };
}
