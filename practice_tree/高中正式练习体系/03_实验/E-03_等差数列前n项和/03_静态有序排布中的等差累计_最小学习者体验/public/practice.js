'use strict';

const elements = {
  app: document.querySelector('#practice-app'),
  loading: document.querySelector('#loading-state'),
  content: document.querySelector('#practice-content'),
  itemProgress: document.querySelector('#item-progress'),
  stepProgress: document.querySelector('#step-progress'),
  progressTrack: document.querySelector('.progress-track'),
  progressFill: document.querySelector('#progress-fill'),
  stem: document.querySelector('#stem-text'),
  prompt: document.querySelector('#current-prompt'),
  form: document.querySelector('#answer-form'),
  controls: document.querySelector('#response-controls'),
  formError: document.querySelector('#form-error'),
  primaryActions: document.querySelector('#primary-actions'),
  hintPanel: document.querySelector('#hint-panel'),
  hintList: document.querySelector('#hint-list'),
  feedbackPanel: document.querySelector('#feedback-panel'),
  feedbackLabel: document.querySelector('#feedback-label'),
  feedbackText: document.querySelector('#feedback-text'),
  completionPanel: document.querySelector('#completion-panel'),
  completionHeading: document.querySelector('#completion-heading'),
  completionText: document.querySelector('#completion-text'),
  continueActions: document.querySelector('#continue-actions'),
  finishedCard: document.querySelector('#finished-card'),
  finishedMessage: document.querySelector('#finished-message'),
  resetButton: document.querySelector('#reset-button'),
  serviceError: document.querySelector('#service-error'),
  serviceErrorText: document.querySelector('#service-error-text'),
  retryButton: document.querySelector('#retry-button')
};

let currentState = null;
let draft = {};
let draftPosition = '';
let busy = false;

class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function api(path, { method = 'GET', body } = {}) {
  const options = {
    method,
    credentials: 'same-origin',
    headers: {}
  };
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(path, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, payload.error, payload.message || '请求没有完成。');
  }
  return payload;
}

function positionKey(state) {
  if (!state?.position?.step) return '';
  return `${state.position.item}:${state.position.step}`;
}

function setBusy(value) {
  busy = value;
  elements.app.setAttribute('aria-busy', String(value));
  for (const button of elements.app.querySelectorAll('button')) {
    button.disabled = value || button.dataset.locked === 'true';
  }
}

function showFormError(message = '') {
  elements.formError.textContent = message;
  elements.formError.hidden = !message;
}

function createButton(label, variant = 'primary') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `button button--${variant}`;
  button.textContent = label;
  return button;
}

function createField({ name, label, value = '', multiline = false, help = '', inputMode = '' }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const fieldLabel = document.createElement('label');
  fieldLabel.htmlFor = `response-${name}`;
  fieldLabel.textContent = label;

  const control = multiline ? document.createElement('textarea') : document.createElement('input');
  control.id = `response-${name}`;
  control.name = name;
  control.autocomplete = 'off';
  control.value = value;
  if (!multiline) control.type = 'text';
  if (inputMode) control.inputMode = inputMode;
  control.addEventListener('input', syncDraftFromForm);

  wrapper.append(fieldLabel, control);
  if (help) {
    const helpText = document.createElement('p');
    helpText.className = 'field-help';
    helpText.textContent = help;
    wrapper.append(helpText);
  }
  return wrapper;
}

function renderChoiceControls(state) {
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'choice-group';

  const legend = document.createElement('legend');
  legend.className = 'visually-hidden';
  legend.textContent = '选择一个答案';
  fieldset.append(legend);

  for (const choice of state.choices ?? []) {
    const label = document.createElement('label');
    label.className = 'choice-option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'choice';
    input.value = choice.value;
    input.checked = draft.choice === choice.value;
    input.addEventListener('change', syncDraftFromForm);

    const text = document.createElement('span');
    text.textContent = `${choice.value}. ${choice.text}`;
    label.append(input, text);
    fieldset.append(label);
  }
  elements.controls.append(fieldset);
}

function renderResponseControls(state) {
  elements.controls.replaceChildren();

  if (state.responseKind === 'choice') {
    renderChoiceControls(state);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'field-grid';

  if (state.responseKind === 'number') {
    const field = createField({
      name: 'answer',
      label: '你的答案',
      value: draft.answer ?? '',
      inputMode: 'numeric'
    });
    field.classList.add('field--wide');
    grid.append(field);
  } else if (state.responseKind === 'calculation') {
    grid.append(
      createField({ name: 'lastTerm', label: '末项', value: draft.lastTerm ?? '', inputMode: 'numeric' }),
      createField({ name: 'total', label: '累计总量', value: draft.total ?? '', inputMode: 'numeric' })
    );
    const work = createField({
      name: 'work',
      label: '完整计算过程',
      value: draft.work ?? '',
      multiline: true,
      help: '等式可使用 ×、÷、+、− 和括号。'
    });
    work.classList.add('field--wide');
    grid.append(work);
  } else if (state.responseKind === 'explanation_check') {
    const fieldIntro = document.createElement('p');
    fieldIntro.className = 'field-intro';
    fieldIntro.textContent = '为了准确判断，把这句话的含义拆成三部分填写。';
    elements.controls.append(fieldIntro);

    const scope = createField({
      name: 'scope',
      label: '累计范围',
      value: draft.scope ?? '',
      help: '只填写这次累计包含的完整对象范围。'
    });
    scope.classList.add('field--wide');
    const total = createField({
      name: 'total',
      label: '结果数值',
      value: draft.total ?? '',
      inputMode: 'numeric'
    });
    const unit = createField({
      name: 'unit',
      label: '结果单位',
      value: draft.unit ?? ''
    });
    const check = createField({
      name: 'check',
      label: '检查方式',
      value: draft.check ?? '',
      multiline: true,
      help: '请写出一种完整等式或数值关系。'
    });
    check.classList.add('field--wide');
    grid.append(scope, total, unit, check);
  }

  elements.controls.append(grid);
}

function responseFromForm() {
  const formData = new FormData(elements.form);
  if (currentState.responseKind === 'choice') return { choice: String(formData.get('choice') ?? '') };
  if (currentState.responseKind === 'number') return { answer: String(formData.get('answer') ?? '') };
  if (currentState.responseKind === 'calculation') {
    return {
      lastTerm: String(formData.get('lastTerm') ?? ''),
      total: String(formData.get('total') ?? ''),
      work: String(formData.get('work') ?? '')
    };
  }
  return {
    scope: String(formData.get('scope') ?? ''),
    total: String(formData.get('total') ?? ''),
    unit: String(formData.get('unit') ?? ''),
    check: String(formData.get('check') ?? '')
  };
}

function syncDraftFromForm() {
  if (!currentState || currentState.phase === 'finished') return;
  draft = responseFromForm();
  draftPosition = positionKey(currentState);
}

function validateResponse(response) {
  if (currentState.responseKind === 'choice' && !response.choice) return '请先选择一个答案。';
  if (currentState.responseKind === 'number' && !response.answer.trim()) return '请先填写答案。';
  return '';
}

function renderHints(state) {
  elements.hintList.replaceChildren();
  for (const hint of state.releasedHints ?? []) {
    const item = document.createElement('li');
    item.textContent = hint;
    elements.hintList.append(item);
  }
  elements.hintPanel.hidden = !state.releasedHints?.length;
}

function renderFeedback(state) {
  const feedback = state.feedback;
  elements.feedbackPanel.hidden = !feedback;
  if (!feedback) return;
  elements.feedbackPanel.dataset.tone = feedback.tone;
  elements.feedbackLabel.textContent = feedback.tone === 'correct' ? '当前一步已通过' : '先修正这一处';
  elements.feedbackText.textContent = feedback.text;
}

function renderCompletion(state) {
  elements.completionPanel.hidden = !state.completion;
  if (!state.completion) return;
  elements.completionHeading.textContent = state.completion.heading;
  elements.completionText.textContent = state.completion.explanation;
}

function renderPrimaryActions(state) {
  elements.primaryActions.replaceChildren();
  if (!state.actions.canSubmit) return;

  const submit = createButton('检查作答', 'primary');
  submit.type = 'submit';
  elements.primaryActions.append(submit);

  if (state.actions.canHint) {
    const hintLabel = state.releasedHints.length ? '查看下一层提示' : '查看第一层提示';
    const hint = createButton(hintLabel, 'secondary');
    hint.addEventListener('click', requestHint);
    elements.primaryActions.append(hint);
  }

  if (state.actions.canReveal) {
    const reveal = createButton('查看完整解答', 'reveal');
    reveal.addEventListener('click', revealAnswer);
    elements.primaryActions.append(reveal);
  }
}

function renderContinueAction(state) {
  elements.continueActions.replaceChildren();
  if (!state.actions.canContinue) return;

  let label = '继续下一步';
  if (state.phase === 'item_complete') {
    label = state.position.item === state.position.itemCount ? '完成本次体验' : '进入下一题';
  }
  const button = createButton(label, 'primary');
  button.addEventListener('click', continuePractice);
  elements.continueActions.append(button);
}

function lockResponseControls(state) {
  const locked = !state.actions.canSubmit;
  for (const control of elements.form.querySelectorAll('input, textarea')) {
    control.disabled = locked;
  }
}

function renderProgress(state) {
  const { item, itemCount, step, stepCount } = state.position;
  elements.itemProgress.textContent = `第 ${item} / ${itemCount} 题`;
  elements.stepProgress.textContent = `第 ${step} / ${stepCount} 步`;
  const progress = ((item - 1) + step / stepCount) / itemCount;
  const progressPercent = Math.min(100, progress * 100);
  elements.progressFill.style.width = `${progressPercent}%`;
  elements.progressTrack.setAttribute('aria-valuenow', String(Math.round(progressPercent)));
  elements.progressTrack.setAttribute('aria-valuetext', `第 ${item} / ${itemCount} 题，第 ${step} / ${stepCount} 步`);
}

function renderFinished(state) {
  elements.loading.hidden = true;
  elements.content.hidden = true;
  elements.serviceError.hidden = true;
  elements.finishedMessage.textContent = state.message;
  elements.finishedCard.hidden = false;
  elements.finishedCard.focus();
}

function renderState(state, { focus = '' } = {}) {
  currentState = state;
  elements.loading.hidden = true;
  elements.serviceError.hidden = true;
  elements.finishedCard.hidden = true;

  if (state.phase === 'finished') {
    renderFinished(state);
    setBusy(false);
    return;
  }

  const key = positionKey(state);
  if (draftPosition && draftPosition !== key) draft = {};
  draftPosition = key;

  elements.content.hidden = false;
  elements.stem.textContent = state.stem;
  elements.prompt.textContent = state.prompt;
  showFormError();
  renderProgress(state);
  renderResponseControls(state);
  renderHints(state);
  renderFeedback(state);
  renderCompletion(state);
  renderPrimaryActions(state);
  renderContinueAction(state);
  lockResponseControls(state);
  setBusy(false);

  if (focus === 'hint' && !elements.hintPanel.hidden) {
    elements.hintPanel.scrollIntoView({ block: 'nearest' });
    elements.hintPanel.focus();
  }
  if (focus === 'feedback' && !elements.feedbackPanel.hidden) elements.feedbackPanel.focus();
  if (focus === 'completion' && !elements.completionPanel.hidden) elements.completionPanel.focus();
  if (focus === 'prompt') elements.prompt.focus?.();
}

function showServiceError(message) {
  elements.loading.hidden = true;
  elements.content.hidden = true;
  elements.finishedCard.hidden = true;
  elements.serviceErrorText.textContent = message || '请确认本地服务仍在运行，然后重试。';
  elements.serviceError.hidden = false;
  setBusy(false);
}

async function perform(action, { focus = '', inlineErrors = true } = {}) {
  if (busy) return;
  setBusy(true);
  showFormError();
  try {
    const state = await action();
    renderState(state, { focus });
  } catch (error) {
    setBusy(false);
    if (error instanceof ApiError && error.code === 'state_changed') {
      try {
        const state = await api('/api/state');
        renderState(state);
      } catch (refreshError) {
        showServiceError(refreshError.message);
      }
      return;
    }
    if (inlineErrors && error instanceof ApiError && error.status < 500) {
      showFormError(error.message);
      return;
    }
    showServiceError(error.message);
  }
}

async function submitAnswer(event) {
  event.preventDefault();
  if (!currentState?.actions?.canSubmit) return;
  const response = responseFromForm();
  draft = response;
  draftPosition = positionKey(currentState);
  const validationMessage = validateResponse(response);
  if (validationMessage) {
    showFormError(validationMessage);
    return;
  }

  await perform(
    () => api('/api/answer', {
      method: 'POST',
      body: { revision: currentState.revision, response }
    }),
    { focus: 'feedback' }
  );
}

async function requestHint() {
  syncDraftFromForm();
  await perform(
    () => api('/api/hint', { method: 'POST', body: { revision: currentState.revision } }),
    { focus: 'hint' }
  );
}

async function revealAnswer() {
  syncDraftFromForm();
  await perform(
    () => api('/api/reveal', { method: 'POST', body: { revision: currentState.revision } }),
    { focus: 'completion' }
  );
}

async function continuePractice() {
  await perform(
    () => api('/api/continue', { method: 'POST', body: { revision: currentState.revision } }),
    { focus: 'prompt' }
  );
}

async function resetPractice() {
  draft = {};
  draftPosition = '';
  await perform(
    () => api('/api/reset', { method: 'POST', body: {} }),
    { focus: 'prompt', inlineErrors: false }
  );
}

async function bootstrap() {
  elements.loading.hidden = false;
  elements.content.hidden = true;
  elements.finishedCard.hidden = true;
  elements.serviceError.hidden = true;
  setBusy(true);
  try {
    let state;
    try {
      state = await api('/api/state');
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) throw error;
      state = await api('/api/reset', { method: 'POST', body: {} });
    }
    renderState(state);
  } catch (error) {
    showServiceError(error.message);
  }
}

elements.form.addEventListener('submit', submitAnswer);
elements.resetButton.addEventListener('click', resetPractice);
elements.retryButton.addEventListener('click', bootstrap);

bootstrap();
