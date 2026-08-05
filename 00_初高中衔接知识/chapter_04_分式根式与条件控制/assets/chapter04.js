(() => {
  "use strict";

  document.querySelectorAll("[data-condition-ledger]").forEach((ledger) => {
    const states = [...ledger.querySelectorAll("[data-ledger-state]")];
    const previous = ledger.querySelector("[data-ledger-prev]");
    const next = ledger.querySelector("[data-ledger-next]");
    const reset = ledger.querySelector("[data-ledger-reset]");
    const live = ledger.querySelector("[data-ledger-live]");
    let current = 0;

    const update = (moveFocus = false) => {
      states.forEach((state, index) => {
        state.classList.toggle("is-current", index === current);
        state.setAttribute("aria-current", index === current ? "step" : "false");
      });
      previous.disabled = current === 0;
      next.disabled = current === states.length - 1;
      const heading = states[current].querySelector("strong")?.textContent || "";
      live.textContent = `当前聚焦：状态 ${current + 1}，${heading}。`;
      if (moveFocus) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        states[current].scrollIntoView({
          block: "nearest",
          behavior: reduceMotion ? "auto" : "smooth"
        });
      }
    };

    previous.addEventListener("click", () => {
      current = Math.max(0, current - 1);
      update(true);
    });
    next.addEventListener("click", () => {
      current = Math.min(states.length - 1, current + 1);
      update(true);
    });
    reset.addEventListener("click", () => {
      current = 0;
      update(true);
      next.focus();
    });
    update();
  });
})();
