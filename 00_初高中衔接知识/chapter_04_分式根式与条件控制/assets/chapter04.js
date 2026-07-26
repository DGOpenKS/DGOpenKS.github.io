(() => {
  const setPressed = (buttons, activeButton) => {
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button === activeButton));
    });
  };

  document.querySelectorAll('[data-value-probe]').forEach((probe) => {
    const buttons = [...probe.querySelectorAll('[data-probe-value]')];
    const original = probe.querySelector('[data-probe-original]');
    const simplified = probe.querySelector('[data-probe-simplified]');
    const feedback = probe.querySelector('[data-probe-feedback]');

    const update = (button) => {
      const value = Number(button.dataset.probeValue);
      setPressed(buttons, button);
      simplified.textContent = `有意义，值为 ${value + 1}`;
      simplified.classList.remove('undefined');

      if (value === 1) {
        original.textContent = '没有意义（分母为 0）';
        original.classList.add('undefined');
        feedback.textContent = '差别出现了：化简式在 x=1 时有值，但原式没有意义，所以必须保留条件 x≠1。';
        feedback.dataset.state = 'incorrect';
      } else {
        const result = (value * value - 1) / (value - 1);
        original.textContent = `有意义，值为 ${result}`;
        original.classList.remove('undefined');
        feedback.textContent = `在 x=${value} 时，两种形式的值相同；这正是它们在 x≠1 的范围内等价。`;
        feedback.dataset.state = 'correct';
      }
    };

    buttons.forEach((button) => button.addEventListener('click', () => update(button)));
    if (buttons[0]) update(buttons[0]);
  });

  document.querySelectorAll('[data-radical-explorer]').forEach((explorer) => {
    const range = explorer.querySelector('input[type="range"]');
    const xOutput = explorer.querySelector('[data-radical-x]');
    const aOutput = explorer.querySelector('[data-radical-a]');
    const squareOutput = explorer.querySelector('[data-radical-square]');
    const rootOutput = explorer.querySelector('[data-radical-root]');
    const absOutput = explorer.querySelector('[data-radical-abs]');
    const feedback = explorer.querySelector('[data-radical-feedback]');

    const update = () => {
      const x = Number(range.value);
      const a = x - 2;
      const square = a * a;
      const result = Math.abs(a);
      xOutput.textContent = x;
      aOutput.textContent = a;
      squareOutput.textContent = square;
      rootOutput.textContent = result;
      absOutput.textContent = result;
      feedback.textContent = a < 0
        ? `此时 x−2=${a}<0，平方根不能返回负数，所以结果是 −(x−2)=${result}。`
        : `此时 x−2=${a}≥0，绝对值可以直接写成 x−2，结果是 ${result}。`;
    };

    range.addEventListener('input', update);
    update();
  });

  document.querySelectorAll('[data-condition-lab]').forEach((lab) => {
    const buttons = [...lab.querySelectorAll('[data-condition-button]')];
    const visual = lab.querySelector('[data-condition-visual]');
    const feedback = lab.querySelector('[data-condition-feedback]');
    const messages = {
      root: '根号先留下 x≥−2：这是从 −2 开始、包含 −2 的一整段范围。',
      denominator: '分母排除 x=−1 和 x=1：这两个点无论是否落在根号范围内，都不能代入原式。',
      combined: '共同范围是 x≥−2，并从中挖掉 −1 和 1，即 [−2,+∞) 去掉 {−1,1}。'
    };

    const update = (button) => {
      const layer = button.dataset.conditionButton;
      setPressed(buttons, button);
      visual.dataset.active = layer;
      feedback.textContent = messages[layer];
    };

    buttons.forEach((button) => button.addEventListener('click', () => update(button)));
    if (buttons[0]) update(buttons[0]);
  });

  const pools = {
    fraction: [
      {
        question: '[(x−2)(x+1)] / [(x−2)(x+3)] 中，x−2 能否约去？',
        answers: ['可以，并保留 x≠2', '可以，约去后 x=2 也允许', '不能，因为上下还有别的因子'],
        correct: 0,
        feedback: 'x−2 是完整的共同因子，可以在 x≠2 时约去；原分母留下的禁点 x=2 必须保留。'
      },
      {
        question: '(x+1)/(x+2) 中，能否把上下的 x 删掉？',
        answers: ['可以，因为符号相同', '不能，x 只是加法中的项', '只有 x≠0 时可以'],
        correct: 1,
        feedback: '共同出现的项不是共同因子。分子、分母没有把 x 作为整体乘法因子，所以不能约。'
      },
      {
        question: '(2x+2)/(x+1) 应怎样化简？',
        answers: ['等于 2，并保留 x≠−1', '等于 2，对所有实数都成立', '不能化简'],
        correct: 0,
        feedback: '先把分子写成 2(x+1)，再约去共同因子 x+1；约分以 x≠−1 为前提。'
      }
    ],
    summary: [
      {
        question: '化简 √[(x−2)²]/(x−3) 后，哪一项结果完整？',
        answers: ['(x−2)/(x−3)', '|x−2|/(x−3)，x≠3', '|x−2|/(x−3)，x≠2'],
        correct: 1,
        feedback: '根式化简要保留绝对值，原分母还要求 x≠3；这两部分必须一起写出。'
      },
      {
        question: '1/√(x−1) 的允许范围是什么？',
        answers: ['x≥1', 'x>1', 'x≠1'],
        correct: 1,
        feedback: '根号要求 x−1≥0，分母又要求 √(x−1)≠0，两者合并得到 x>1。'
      },
      {
        question: '完成等价化简后，最后应检查什么？',
        answers: ['式子是否最短', '原式条件是否全部保留', '是否使用了最多公式'],
        correct: 1,
        feedback: '等价不仅看形式，还要确认禁点、非负条件与共同范围没有在变形中丢失。'
      }
    ]
  };

  document.querySelectorAll('[data-practice]').forEach((lab) => {
    const pool = pools[lab.dataset.practice];
    if (!pool) return;

    const question = lab.querySelector('[data-practice-question]');
    const answerList = lab.querySelector('[data-answer-list]');
    const feedback = lab.querySelector('[data-practice-feedback]');
    const next = lab.querySelector('[data-next-question]');
    let index = 0;

    const render = () => {
      const item = pool[index];
      question.textContent = item.question;
      feedback.textContent = '先判断结构，再选择答案。';
      feedback.dataset.state = '';
      answerList.replaceChildren();

      item.answers.forEach((answer, answerIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'answer-button';
        button.textContent = answer;
        button.addEventListener('click', () => {
          const buttons = [...answerList.querySelectorAll('button')];
          buttons.forEach((candidate, candidateIndex) => {
            candidate.disabled = true;
            if (candidateIndex === item.correct) candidate.classList.add('is-correct');
          });

          if (answerIndex === item.correct) {
            feedback.textContent = `判断正确。${item.feedback}`;
            feedback.dataset.state = 'correct';
          } else {
            button.classList.add('is-incorrect');
            feedback.textContent = `再看一次结构。${item.feedback}`;
            feedback.dataset.state = 'incorrect';
          }
        });
        answerList.append(button);
      });
    };

    next.addEventListener('click', () => {
      index = (index + 1) % pool.length;
      render();
      question.focus();
    });

    render();
  });
})();
