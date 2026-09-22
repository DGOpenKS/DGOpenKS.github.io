/* Shared, opt-in margin figures. No copies: SVG IDs, focus and controls survive. */
(() => {
  'use strict';
  const entries = [...document.querySelectorAll('[data-d-float]')].flatMap(figure => {
    let end;
    try { end = document.querySelector(figure.dataset.dFloatEnd); } catch (_) { return []; }
    const body = figure.closest('.section-body');
    if (!end || !body) return [];
    const placeholder = document.createElement('div');
    placeholder.className = 'd-float-placeholder';
    placeholder.hidden = true;
    placeholder.setAttribute('aria-hidden', 'true');
    figure.before(placeholder);
    return [{figure, end, body, placeholder, floating:false}];
  });
  if (!entries.length) return;
  let frame = 0;
  let printing = false;
  const positive = (value, fallback) => Number(value) > 0 ? Number(value) : fallback;
  function restore(entry) {
    if (!entry.floating) return;
    entry.figure.classList.remove('is-d-floating');
    for (const name of ['top', 'left', 'width']) entry.figure.style.removeProperty('--d-float-' + name);
    entry.placeholder.hidden = true;
    entry.floating = false;
  }
  function update() {
    frame = 0;
    const viewport = document.documentElement.clientWidth;
    const height = window.innerHeight;
    const nav = document.querySelector('.topbar');
    const navBottom = nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 0;
    const markers = [...document.querySelectorAll('.marker')].map(el => el.getBoundingClientRect());
    let candidate = null;
    const atPageEnd = window.scrollY + height >= document.documentElement.scrollHeight - 2;
    if (!printing && !atPageEnd && viewport >= 1024) {
      for (const entry of entries) {
        const {figure, placeholder, body, end, floating} = entry;
        const origin = (floating ? placeholder : figure).getBoundingClientRect();
        const endThreshold = Math.max(navBottom + 24,
          (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) +
          (parseFloat(getComputedStyle(end).scrollMarginTop) || 0) + 8);
        // Only take over when the entire original figure is above the reading area.
        if (origin.bottom > navBottom || end.getBoundingClientRect().top <= endThreshold) continue;
        const minWidth = positive(figure.dataset.dFloatMinWidth, 300);
        const maxWidth = Math.max(minWidth, positive(figure.dataset.dFloatMaxWidth, 500));
        const right = body.getBoundingClientRect().left - 24;
        const width = Math.min(maxWidth, right - 16);
        if (width < minWidth) continue;
        const left = right - width;
        const top = navBottom + 24;
        if (height - top < 240) continue;
        const slots = [{left, top, width}];
        // Keep diagrams as large as possible; use the outer margin only if needed.
        const visibleMarkers = markers.filter(rect => rect.bottom > navBottom && rect.top < height && rect.left < right);
        if (visibleMarkers.length) {
          const outerWidth = Math.min(maxWidth, ...visibleMarkers.map(rect => rect.left - 40));
          if (outerWidth >= minWidth) {
            const outer = {left:16, top, width:outerWidth};
            if (outerWidth >= width) slots.unshift(outer);
            else slots.push(outer);
          }
        }
        candidate = {entry, origin, slots};
      }
    }
    for (const entry of entries) if (entry !== candidate?.entry) restore(entry);
    if (!candidate) return;
    const {entry, origin, slots} = candidate;
    const {figure, placeholder} = entry;
    if (!entry.floating) {
      const style = getComputedStyle(figure);
      placeholder.style.width = origin.width + 'px';
      placeholder.style.height = origin.height + 'px';
      placeholder.style.margin = style.margin;
      placeholder.hidden = false;
      figure.classList.add('is-d-floating');
      entry.floating = true;
    }
    for (const slot of slots) {
      const {left, width} = slot;
      let {top} = slot;
      figure.style.setProperty('--d-float-left', left + 'px');
      figure.style.setProperty('--d-float-top', top + 'px');
      figure.style.setProperty('--d-float-width', width + 'px');
      // Section numbers are already sticky. Only avoid ones that actually intersect.
      const figureHeight = figure.getBoundingClientRect().height;
      for (const rect of markers.sort((a, b) => a.top - b.top)) {
        if (rect.right > left && rect.left < left + width && rect.bottom > top && rect.top < top + figureHeight) {
          top = rect.bottom + 16;
        }
      }
      figure.style.setProperty('--d-float-top', top + 'px');
      // Never clip the figure or its controls, or shrink text to force a fit.
      const rect = figure.getBoundingClientRect();
      if (rect.bottom <= height - 16 && figure.scrollWidth <= figure.clientWidth + 1) return;
    }
    restore(entry);
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', () => {
    entries.forEach(restore);
    schedule();
  }, {passive:true});
  window.addEventListener('hashchange', schedule);
  window.addEventListener('load', schedule);
  for (const name of ['input', 'change', 'click', 'focusin']) document.addEventListener(name, schedule);
  window.addEventListener('beforeprint', () => {
    printing = true;
    entries.forEach(restore);
  });
  window.addEventListener('afterprint', () => { printing = false; schedule(); });
  if (document.fonts) document.fonts.ready.then(schedule);
  schedule();
})();
