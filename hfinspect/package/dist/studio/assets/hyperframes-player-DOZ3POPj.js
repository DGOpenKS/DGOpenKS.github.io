var le=Object.defineProperty;var he=(n,e,t)=>e in n?le(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var c=(n,e,t)=>he(n,typeof e!="symbol"?e+"":e,t);function ce(n){return n.hasRuntime||n.runtimeInjected?!1:!!(n.hasNestedCompositions||n.hasTimelines&&n.attempts>=5)}function D(n){return typeof n=="object"&&n!==null}function ue(n){return D(n)&&typeof n.getDuration=="function"}function pe(n){return D(n)&&typeof n.duration=="function"&&typeof n.time=="function"&&typeof n.seek=="function"&&typeof n.play=="function"&&typeof n.pause=="function"}const me="https://cdn.jsdelivr.net/npm/@hyperframes/core/dist/hyperframe.runtime.iife.js";function ee(n){if(n===null)return null;const e=Number.parseInt(n,10);return Number.isFinite(e)&&e>0?e:null}function fe(n){const e=(n==null?void 0:n.querySelector("[data-composition-id][data-width][data-height]"))??(n==null?void 0:n.querySelector("[data-width][data-height]"));if(!e)return null;const t=ee(e.getAttribute("data-width")),i=ee(e.getAttribute("data-height"));return t!==null&&i!==null?{width:t,height:i}:null}class _e{constructor(e,t){c(this,"_interval",null);c(this,"_runtimeInjected",!1);this._iframe=e,this._callbacks=t}get runtimeInjected(){return this._runtimeInjected}start(){this.stop(),this._runtimeInjected=!1;let e=0;this._interval=setInterval(()=>{var t;e++;try{const i=this._iframe.contentWindow;if(!i)return;const r=!!(i.__hf||i.__player),s=!!(i.__timelines&&Object.keys(i.__timelines).length>0),a=!!((t=this._iframe.contentDocument)!=null&&t.querySelector("[data-composition-src]"));if(ce({hasRuntime:r,hasTimelines:s,hasNestedCompositions:a,runtimeInjected:this._runtimeInjected,attempts:e})){this._injectRuntime();return}if(this._runtimeInjected&&!r)return;const d=this._resolvePlaybackDurationAdapter(i);if(d&&d.getDuration()>0){this.stop();const u=fe(this._iframe.contentDocument);this._callbacks.onReady({duration:d.getDuration(),adapter:d,compositionSize:u});return}}catch{}e>=40&&(this.stop(),this._callbacks.onError("Composition timeline not found after 8s"))},200)}stop(){this._interval!==null&&(clearInterval(this._interval),this._interval=null)}resolveDirectTimelineAdapter(){try{const e=this._iframe.contentWindow;return e?this._resolveDirectTimelineAdapterFromWindow(e):null}catch{return null}}resolveDirectTimelineAdapterFromWindow(e){return this._resolveDirectTimelineAdapterFromWindow(e)}hasRuntimeBridge(e){return Reflect.get(e,"__hf")!==void 0||D(Reflect.get(e,"__player"))}_injectRuntime(){var e,t;this._runtimeInjected=!0;try{const i=this._iframe.contentDocument;if(!i)return;const r=i.createElement("script");r.src=me,(i.head||i.documentElement).appendChild(r),(t=(e=this._callbacks).onRuntimeInjected)==null||t.call(e)}catch{}}_resolveDirectTimelineAdapterFromWindow(e){var d,u;if(this.hasRuntimeBridge(e))return null;const t=Reflect.get(e,"__timelines");if(!D(t))return null;const i=Object.keys(t);if(i.length===0)return null;const r=(u=(d=this._iframe.contentDocument)==null?void 0:d.querySelector("[data-composition-id]"))==null?void 0:u.getAttribute("data-composition-id"),s=r&&r in t?r:i[i.length-1],a=t[s];return pe(a)?a:null}_resolvePlaybackDurationAdapter(e){const t=Reflect.get(e,"__player");if(ue(t))return{kind:"runtime",getDuration:()=>t.getDuration()};const i=this._resolveDirectTimelineAdapterFromWindow(e);return i?{kind:"direct-timeline",timeline:i,getDuration:()=>i.duration()}:null}}const ge=`
  :host {
    display: block;
    position: relative;
    overflow: hidden;
    background: #000;
    contain: layout style;
  }

  .hfp-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }


  .hfp-iframe {
    position: absolute;
    top: 50%;
    left: 50%;
    border: none;
    pointer-events: none;
  }

  .hfp-poster {
    position: absolute;
    inset: 0;
    object-fit: contain;
    z-index: 1;
    pointer-events: none;
  }

  .hfp-shader-loader {
    position: absolute;
    inset: 0;
    z-index: 20;
    display: grid;
    place-items: center;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    background: #030504;
    color: #f4f7fb;
    cursor: default;
    user-select: none;
    -webkit-user-select: none;
    transition: opacity 420ms ease-out, visibility 420ms ease-out;
  }

  .hfp-shader-loader.hfp-visible,
  .hfp-shader-loader.hfp-hiding {
    visibility: visible;
  }

  .hfp-shader-loader.hfp-visible {
    opacity: 1;
    pointer-events: auto;
  }

  .hfp-shader-loader.hfp-hiding {
    opacity: 0;
    pointer-events: none;
  }

  .hfp-shader-loader-panel {
    display: grid;
    grid-template-rows: 86px 40px 26px 12px 44px;
    justify-items: center;
    align-items: center;
    gap: 8px;
    width: min(620px, 82%);
    text-align: center;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .hfp-shader-loader-mark {
    width: 86px;
    height: 86px;
    display: grid;
    place-items: center;
    overflow: visible;
  }

  .hfp-shader-loader-mark svg {
    display: block;
    overflow: visible;
    filter: drop-shadow(0 0 5px rgba(79, 219, 94, 0.16));
    pointer-events: none;
  }

  .hfp-shader-loader-title {
    width: 100%;
    height: 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 26px;
    line-height: 40px;
    font-weight: 700;
    letter-spacing: 0;
  }

  .hfp-shader-loader-title-text {
    color: transparent;
    background: linear-gradient(
      90deg,
      rgba(244, 247, 251, 0.84) 0%,
      #ffffff 42%,
      #80efe4 52%,
      #ffffff 62%,
      rgba(244, 247, 251, 0.84) 100%
    );
    background-size: 220% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    animation: hfp-shader-loader-sheen 1.9s linear infinite;
  }

  .hfp-shader-loader-detail {
    width: 100%;
    height: 26px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgba(244, 247, 251, 0.62);
    font-size: 15px;
    line-height: 26px;
    font-weight: 500;
  }

  .hfp-shader-loader-track {
    width: min(360px, 100%);
    height: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
  }

  .hfp-shader-loader-fill {
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #06e3fa, #4fdb5e);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 160ms ease;
  }

  .hfp-shader-loader-progress {
    width: min(420px, 100%);
    height: 44px;
    display: grid;
    grid-template-rows: repeat(2, 22px);
    color: rgba(244, 247, 251, 0.48);
    font: 600 13px/22px "IBM Plex Mono", "SF Mono", "Fira Code", "Courier New", monospace;
    font-variant-numeric: tabular-nums;
  }

  .hfp-shader-loader-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 74px;
    align-items: center;
    column-gap: 20px;
    width: 100%;
    white-space: nowrap;
  }

  .hfp-shader-loader-label {
    min-width: 0;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
  }

  .hfp-shader-loader-value {
    text-align: right;
  }

  @keyframes hfp-shader-loader-sheen {
    from {
      background-position: 140% 0;
    }
    to {
      background-position: -140% 0;
    }
  }

  /* ── Theming via CSS custom properties ──
   *
   * Override from outside the shadow DOM:
   *   hyperframes-player {
   *     --hfp-controls-bg: linear-gradient(transparent, rgba(0,0,0,0.9));
   *     --hfp-accent: #ff6b6b;
   *     --hfp-font: "Inter", sans-serif;
   *   }
   */

  .hfp-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: var(--hfp-controls-gap, 12px);
    padding: var(--hfp-controls-padding, 8px 16px);
    background: var(--hfp-controls-bg, linear-gradient(transparent, rgba(0, 0, 0, 0.7)));
    color: var(--hfp-color, #fff);
    font-family: var(--hfp-font, system-ui, -apple-system, sans-serif);
    font-size: var(--hfp-font-size, 13px);
    z-index: 10;
    pointer-events: auto;
    opacity: 1;
    transition: opacity 0.3s ease;
    user-select: none;
  }

  .hfp-controls.hfp-hidden {
    opacity: 0;
    pointer-events: none;
  }

  .hfp-play-btn {
    background: none;
    border: none;
    color: var(--hfp-color, #fff);
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    z-index: 10;
  }

  .hfp-play-btn:hover {
    opacity: 0.8;
  }

  .hfp-play-btn svg,
  .hfp-play-btn svg * {
    pointer-events: none;
  }

  .hfp-scrubber {
    flex: 1;
    min-width: 0;
    height: var(--hfp-scrubber-height, 4px);
    background: var(--hfp-scrubber-bg, rgba(255, 255, 255, 0.3));
    border-radius: var(--hfp-scrubber-radius, 2px);
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .hfp-scrubber:hover {
    height: var(--hfp-scrubber-height-hover, 6px);
  }

  .hfp-progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--hfp-accent, #fff);
    pointer-events: none;
  }

  .hfp-time {
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    opacity: 0.9;
  }

  .hfp-speed-wrap {
    position: relative;
    flex-shrink: 0;
  }

  .hfp-speed-btn {
    background: var(--hfp-speed-btn-bg, rgba(255, 255, 255, 0.15));
    border: none;
    border-radius: var(--hfp-speed-btn-radius, 4px);
    color: var(--hfp-color, #fff);
    cursor: pointer;
    font-family: var(--hfp-font, system-ui, -apple-system, sans-serif);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    padding: 4px 8px;
    min-width: 40px;
    text-align: center;
    transition: background 0.15s ease;
  }

  .hfp-speed-btn:hover {
    background: var(--hfp-speed-btn-bg-hover, rgba(255, 255, 255, 0.3));
  }

  .hfp-speed-menu {
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    background: var(--hfp-menu-bg, rgba(20, 20, 20, 0.95));
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--hfp-menu-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--hfp-menu-radius, 8px);
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 80px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(4px);
    transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
    box-shadow: var(--hfp-menu-shadow, 0 8px 24px rgba(0, 0, 0, 0.4));
  }

  .hfp-speed-menu.hfp-open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .hfp-speed-option {
    background: none;
    border: none;
    border-radius: 4px;
    color: var(--hfp-menu-color, rgba(255, 255, 255, 0.7));
    cursor: pointer;
    font-family: var(--hfp-font, system-ui, -apple-system, sans-serif);
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    padding: 6px 12px;
    text-align: left;
    transition: background 0.1s ease, color 0.1s ease;
    white-space: nowrap;
  }

  .hfp-speed-option:hover {
    background: var(--hfp-menu-hover-bg, rgba(255, 255, 255, 0.1));
    color: var(--hfp-color, #fff);
  }

  .hfp-speed-option.hfp-active {
    color: var(--hfp-accent, #fff);
    font-weight: 600;
  }

  .hfp-volume-wrap {
    position: relative;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0;
  }

  .hfp-mute-btn {
    background: none;
    border: none;
    color: var(--hfp-color, #fff);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  .hfp-mute-btn:hover {
    opacity: 0.8;
  }

  .hfp-mute-btn svg,
  .hfp-mute-btn svg * {
    pointer-events: none;
  }

  .hfp-volume-slider-wrap {
    width: 0;
    overflow: hidden;
    transition: width 0.2s ease;
    display: flex;
    align-items: center;
  }

  .hfp-volume-wrap:hover .hfp-volume-slider-wrap {
    width: 64px;
  }

  .hfp-volume-slider {
    width: 56px;
    height: var(--hfp-scrubber-height, 4px);
    background: var(--hfp-scrubber-bg, rgba(255, 255, 255, 0.3));
    border-radius: var(--hfp-scrubber-radius, 2px);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-left: 4px;
    margin-right: 4px;
  }

  .hfp-volume-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--hfp-accent, #fff);
    pointer-events: none;
  }
`,te='<svg width="24" height="24" viewBox="0 0 18 18" fill="currentColor"><polygon points="4,2 16,9 4,16"/></svg>',be='<svg width="24" height="24" viewBox="0 0 18 18" fill="currentColor"><rect x="3" y="2" width="4" height="14"/><rect x="11" y="2" width="4" height="14"/></svg>',ie='<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/><path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',re='<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>',ve='<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" opacity="0.3"/><line x1="18" y1="7" x2="14" y2="17" stroke="currentColor" stroke-width="2"/></svg>',ye=[.25,.5,1,1.5,2,4];function N(n){return Number.isInteger(n)?`${n}x`:`${n}x`}function ne(n){if(!Number.isFinite(n)||n<0)return"0:00";const e=Math.floor(n),t=Math.floor(e/60),i=e%60;return`${t}:${i.toString().padStart(2,"0")}`}function we(n,e,t={}){const i=t.speedPresets??ye,r=document.createElement("div");r.className="hfp-controls",r.addEventListener("click",o=>{o.stopPropagation()});const s=document.createElement("button");s.className="hfp-play-btn",s.type="button",s.innerHTML=te,s.setAttribute("aria-label","Play");const a=document.createElement("div");a.className="hfp-scrubber";const d=document.createElement("div");d.className="hfp-progress",d.style.width="0%",a.appendChild(d);const u=document.createElement("span");u.className="hfp-time",u.textContent="0:00 / 0:00";const m=document.createElement("div");m.className="hfp-speed-wrap";const p=document.createElement("button");p.className="hfp-speed-btn",p.type="button",p.textContent="1x",p.setAttribute("aria-label","Playback speed");const h=document.createElement("div");h.className="hfp-speed-menu",h.setAttribute("role","menu");for(const o of i){const l=document.createElement("button");l.className="hfp-speed-option",l.type="button",l.setAttribute("role","menuitem"),l.dataset.speed=String(o),l.textContent=N(o),o===1&&l.classList.add("hfp-active"),h.appendChild(l)}m.appendChild(h),m.appendChild(p);const b=document.createElement("div");b.className="hfp-volume-wrap";const f=document.createElement("button");f.className="hfp-mute-btn",f.type="button",f.innerHTML=ie,f.setAttribute("aria-label","Mute");const g=document.createElement("div");g.className="hfp-volume-slider-wrap";const _=document.createElement("div");_.className="hfp-volume-slider",_.setAttribute("role","slider"),_.setAttribute("aria-label","Volume"),_.setAttribute("aria-valuemin","0"),_.setAttribute("aria-valuemax","100"),_.setAttribute("aria-valuenow","100"),_.tabIndex=0;const y=document.createElement("div");y.className="hfp-volume-fill",y.style.width="100%",_.appendChild(y),g.appendChild(_),b.appendChild(g),b.appendChild(f),r.appendChild(s),r.appendChild(a),r.appendChild(u),r.appendChild(b),r.appendChild(m),n.appendChild(r);let M=!1,A=!1,w=1,x=null;i.indexOf(1);const L=(o,l)=>o?ve:l===0||l<.5?re:ie;s.addEventListener("click",o=>{o.stopPropagation(),M?e.onPause():e.onPlay()}),f.addEventListener("click",o=>{o.stopPropagation(),e.onMuteToggle()});let E=!1;const P=o=>{const l=_.getBoundingClientRect(),v=Math.max(0,Math.min(1,(o-l.left)/l.width));w=v,y.style.width=`${v*100}%`,_.setAttribute("aria-valuenow",String(Math.round(v*100))),A&&v>0&&e.onMuteToggle(),f.innerHTML=L(A,v),e.onVolumeChange(v)};_.addEventListener("mousedown",o=>{o.stopPropagation(),E=!0,P(o.clientX)});const $=o=>{E&&P(o.clientX)},z=()=>{E=!1};document.addEventListener("mousemove",$),document.addEventListener("mouseup",z),_.addEventListener("touchstart",o=>{E=!0;const l=o.touches[0];l&&P(l.clientX)},{passive:!0});const j=o=>{if(E){const l=o.touches[0];l&&P(l.clientX)}},q=()=>{E=!1};document.addEventListener("touchmove",j,{passive:!0}),document.addEventListener("touchend",q);const B=.05;_.addEventListener("keydown",o=>{let l=w;if(o.key==="ArrowRight"||o.key==="ArrowUp")l=Math.min(1,w+B);else if(o.key==="ArrowLeft"||o.key==="ArrowDown")l=Math.max(0,w-B);else return;o.preventDefault(),o.stopPropagation(),w=l,y.style.width=`${l*100}%`,_.setAttribute("aria-valuenow",String(Math.round(l*100))),A&&l>0&&e.onMuteToggle(),f.innerHTML=L(A,l),e.onVolumeChange(l)});const W=o=>{for(const l of h.querySelectorAll(".hfp-speed-option"))l.classList.toggle("hfp-active",l.dataset.speed===String(o))};p.addEventListener("click",o=>{o.stopPropagation();const l=h.classList.toggle("hfp-open");p.setAttribute("aria-expanded",String(l))}),h.addEventListener("click",o=>{o.stopPropagation();const l=o.target.closest(".hfp-speed-option");if(!l)return;const v=parseFloat(l.dataset.speed);i.indexOf(v),p.textContent=N(v),W(v),h.classList.remove("hfp-open"),p.setAttribute("aria-expanded","false"),e.onSpeedChange(v)});const X=()=>{h.classList.remove("hfp-open"),p.setAttribute("aria-expanded","false")};document.addEventListener("click",X);const R=o=>{const l=a.getBoundingClientRect(),v=Math.max(0,Math.min(1,(o-l.left)/l.width));e.onSeek(v)};let T=!1;a.addEventListener("mousedown",o=>{o.stopPropagation(),T=!0,R(o.clientX)});const G=o=>{T&&R(o.clientX)},Y=()=>{T=!1};document.addEventListener("mousemove",G),document.addEventListener("mouseup",Y),a.addEventListener("touchstart",o=>{T=!0;const l=o.touches[0];l&&R(l.clientX)},{passive:!0});const Q=o=>{if(T){const l=o.touches[0];l&&R(l.clientX)}},J=()=>{T=!1};document.addEventListener("touchmove",Q,{passive:!0}),document.addEventListener("touchend",J);const K=()=>{x&&clearTimeout(x),x=setTimeout(()=>{M&&r.classList.add("hfp-hidden")},3e3)},Z=n instanceof ShadowRoot?n.host:n;return Z.addEventListener("mousemove",()=>{r.classList.remove("hfp-hidden"),K()}),Z.addEventListener("mouseleave",()=>{M&&r.classList.add("hfp-hidden")}),{updateTime(o,l){const v=l>0?Math.min(o,l):o,de=l>0?v/l*100:0;d.style.width=`${de}%`,u.textContent=`${ne(v)} / ${ne(l)}`},updatePlaying(o){M=o,s.innerHTML=o?be:te,s.setAttribute("aria-label",o?"Pause":"Play"),o?K():r.classList.remove("hfp-hidden")},updateSpeed(o){i.indexOf(o),p.textContent=N(o),W(o)},updateMuted(o){A=o,f.innerHTML=L(o,w),f.setAttribute("aria-label",o?"Unmute":"Mute")},updateVolume(o){w=o,y.style.width=`${o*100}%`,_.setAttribute("aria-valuenow",String(Math.round(o*100))),f.innerHTML=L(A,o)},show(){r.style.display=""},hide(){r.style.display="none"},destroy(){document.removeEventListener("mousemove",G),document.removeEventListener("mouseup",Y),document.removeEventListener("touchmove",Q),document.removeEventListener("touchend",J),document.removeEventListener("mousemove",$),document.removeEventListener("mouseup",z),document.removeEventListener("touchmove",j),document.removeEventListener("touchend",q),document.removeEventListener("click",X),x&&clearTimeout(x)}}}function Ae(n,e,t,i,r){const s=i?i.split(",").map(Number).filter(u=>!isNaN(u)&&u>0):void 0,d=we(n,r,s?{speedPresets:s}:{});return d.updateMuted(e),d.updateVolume(t),d}function se(n,e,t){return e?(t||(t=document.createElement("img"),t.className="hfp-poster",n.appendChild(t)),t.src=e,t):(t==null||t.remove(),null)}function Ee(n){return n.composedPath().some(e=>e instanceof HTMLElement&&e.classList.contains("hfp-controls"))}let I=null;function Te(n,e){if(typeof CSSStyleSheet<"u")try{I||(I=new CSSStyleSheet,I.replaceSync(e)),n.adoptedStyleSheets=[I];return}catch{}const t=document.createElement("style");t.textContent=e,n.appendChild(t)}function Ce(){const n=document.createElement("div");n.className="hfp-container";const e=document.createElement("iframe");return e.className="hfp-iframe",e.sandbox.add("allow-scripts","allow-same-origin"),e.allow="autoplay; fullscreen",e.referrerPolicy="no-referrer",e.title="HyperFrames Composition",n.appendChild(e),{container:n,iframe:e}}function xe(n,e,t,i){const r=n.offsetWidth,s=n.offsetHeight;if(r===0||s===0)return;const a=Math.min(r/t,s/i);e.style.width=`${t}px`,e.style.height=`${i}px`,e.style.transform=`translate(-50%, -50%) scale(${a})`}const ke=100;class Se{constructor(e){c(this,"_raf",null);c(this,"_lastUpdateMs",0);this._callbacks=e}start(e,t,i,r){this.stop();const s=()=>{if(r()){this._raf=null;return}let a;try{a=e.time()}catch{this._raf=null;return}const d=i();d>0&&(a=Math.min(a,d));const u=d>0&&a>=d,m=performance.now();if((m-this._lastUpdateMs>ke||u)&&(this._lastUpdateMs=m,this._callbacks.onTimeUpdate(a,d)),u){if(this._callbacks.getLoop()){this._callbacks.restart();return}try{e.pause()}catch{}this._callbacks.onPaused(),this._raf=null;return}this._raf=requestAnimationFrame(s)};this._raf=requestAnimationFrame(s)}stop(){this._raf!==null&&(cancelAnimationFrame(this._raf),this._raf=null)}get isRunning(){return this._raf!==null}}function Me(n){const e=Array.from(n.querySelectorAll("[data-composition-id]"));if(e.length===0)return n.body?[n.body]:[];const t=[];for(const i of e)Pe(i)||t.push(i);return Le(n),t}function Le(n){const e=n.body;if(!e||typeof console>"u"||typeof console.warn!="function")return;const t=e.querySelectorAll("audio[data-start], video[data-start]");if(t.length===0)return;const i=[];for(const r of t)r.closest("[data-composition-id]")||i.push(r);i.length!==0&&console.warn(`[hyperframes-player] selectMediaObserverTargets: composition hosts are present, but ${i.length} body-level timed media element(s) sit outside every [data-composition-id] subtree and will not be observed. Move them inside a composition host or the parent-frame proxy will never adopt them.`,i)}function Pe(n){let e=n.parentElement;for(;e;){if(e.hasAttribute("data-composition-id"))return!0;e=e.parentElement}return!1}const Re=.05,Ie=2;class Oe{constructor(e){c(this,"_entries",[]);c(this,"_mediaObserver");c(this,"_playbackErrorPosted",!1);c(this,"_audioOwner","runtime");c(this,"_dispatchEvent");c(this,"_getMuted");c(this,"_getVolume");c(this,"_getPlaybackRate");c(this,"_getCurrentTime");c(this,"_isPaused");this._dispatchEvent=e.dispatchEvent,this._getMuted=e.getMuted,this._getVolume=e.getVolume,this._getPlaybackRate=e.getPlaybackRate,this._getCurrentTime=e.getCurrentTime,this._isPaused=e.isPaused}get audioOwner(){return this._audioOwner}get entries(){return this._entries}get playbackErrorPosted(){return this._playbackErrorPosted}resetForIframeLoad(){this._playbackErrorPosted=!1;const e=this._audioOwner==="parent";this._audioOwner="runtime",this.pauseAll(),this.teardownObserver(),e&&this._dispatchEvent(new CustomEvent("audioownershipchange",{detail:{owner:"runtime",reason:"iframe-reload"}}))}destroy(){this.teardownObserver();for(const e of this._entries)e.el.pause(),e.el.src="";this._entries=[]}updateMuted(e){for(const t of this._entries)t.el.muted=e}updateVolume(e){for(const t of this._entries)t.el.volume=e}updatePlaybackRate(e){for(const t of this._entries)t.el.playbackRate=e}playAll(){for(const e of this._entries)e.el.src&&e.el.play().catch(t=>this._reportPlaybackError(t))}pauseAll(){for(const e of this._entries)e.el.pause()}seekAll(e){for(const t of this._entries){const i=e-t.start;i>=0&&i<t.duration&&(t.el.currentTime=i)}}mirrorTime(e,t){const i=(t==null?void 0:t.force)===!0;for(const r of this._entries){const s=e-r.start;if(s<0||s>=r.duration){r.driftSamples=0;continue}Math.abs(r.el.currentTime-s)>Re?(r.driftSamples+=1,(i||r.driftSamples>=Ie)&&(r.el.currentTime=s,r.driftSamples=0)):r.driftSamples=0}}promoteToParentProxy(e,t){if(this._audioOwner==="parent")return;if(this._audioOwner="parent",e)for(const r of e.querySelectorAll("video, audio"))r.muted=!0;const i=this._getCurrentTime();t?t(i,{force:!0}):this.mirrorTime(i,{force:!0}),this._isPaused()||this.playAll(),this._dispatchEvent(new CustomEvent("audioownershipchange",{detail:{owner:"parent",reason:"autoplay-blocked"}}))}setupFromIframe(e){const t=e.querySelectorAll("audio[data-start], video[data-start]");for(const i of t)this._adoptIframeMedia(i);this._observeDynamicMedia(e)}setupFromUrl(e){this._createEntry(e,"audio",0,1/0)}teardownObserver(){var e;(e=this._mediaObserver)==null||e.disconnect(),this._mediaObserver=void 0}_reportPlaybackError(e){this._playbackErrorPosted||(this._playbackErrorPosted=!0,this._dispatchEvent(new CustomEvent("playbackerror",{detail:{source:"parent-proxy",error:e}})))}_createEntry(e,t,i,r){if(this._entries.some(u=>u.el.src===e))return null;const s=t==="video"?document.createElement("video"):new Audio;s.preload="auto",s.src=e,s.load(),s.muted=this._getMuted(),s.volume=this._getVolume();const a=this._getPlaybackRate();a!==1&&(s.playbackRate=a);const d={el:s,start:i,duration:r,driftSamples:0};return this._entries.push(d),d}_adoptIframeMedia(e){var u;if(e.preload==="metadata"||e.preload==="none")return;const t=e.getAttribute("src")||((u=e.querySelector("source"))==null?void 0:u.getAttribute("src"));if(!t)return;const i=new URL(t,e.ownerDocument.baseURI).href,r=parseFloat(e.getAttribute("data-start")||"0"),s=parseFloat(e.getAttribute("data-duration")||"Infinity"),a=e.tagName==="VIDEO"?"video":"audio",d=this._createEntry(i,a,r,s);d&&this._audioOwner==="parent"&&(this.mirrorTime(this._getCurrentTime(),{force:!0}),!this._isPaused()&&d.el.src&&d.el.play().catch(m=>this._reportPlaybackError(m)))}_detachIframeMedia(e){var a;const t=e.getAttribute("src")||((a=e.querySelector("source"))==null?void 0:a.getAttribute("src"));if(!t)return;const i=new URL(t,e.ownerDocument.baseURI).href,r=this._entries.findIndex(d=>d.el.src===i);if(r===-1)return;const s=this._entries[r];s.el.pause(),s.el.src="",this._entries.splice(r,1)}_observeDynamicMedia(e){if(this.teardownObserver(),typeof MutationObserver>"u"||!e.body)return;const t=new MutationObserver(s=>{var a,d,u,m;for(const p of s){if(p.type==="attributes"&&p.attributeName==="preload"){const h=p.target;h instanceof HTMLMediaElement&&h.matches("audio[data-start], video[data-start]")&&h.preload==="auto"&&this._adoptIframeMedia(h);continue}for(const h of p.addedNodes){if(!(h instanceof Element))continue;const b=[];(a=h.matches)!=null&&a.call(h,"audio[data-start], video[data-start]")&&b.push(h);const f=(d=h.querySelectorAll)==null?void 0:d.call(h,"audio[data-start], video[data-start]");if(f)for(const g of f)b.push(g);for(const g of b)this._adoptIframeMedia(g)}for(const h of p.removedNodes){if(!(h instanceof Element))continue;const b=[];(u=h.matches)!=null&&u.call(h,"audio[data-start], video[data-start]")&&b.push(h);const f=(m=h.querySelectorAll)==null?void 0:m.call(h,"audio[data-start], video[data-start]");if(f)for(const g of f)b.push(g);for(const g of b)this._detachIframeMedia(g)}}}),i={childList:!0,subtree:!0,attributes:!0,attributeFilter:["preload"]},r=Me(e);for(const s of r)t.observe(s,i);this._mediaObserver=t}}const De=100;function Ne(n,e,t,i){const r=(n.frame??0)/e,s=t.duration>0?Math.min(r,t.duration):r,a=!t.paused,d=!n.isPlaying,u=t.duration>0&&s>=t.duration&&(a||n.isPlaying);if(u&&i.getLoop())return i.media.audioOwner==="parent"&&i.media.pauseAll(),i.seek(0),i.play(),{...t,currentTime:s,paused:!1};const m={...t,currentTime:s,paused:d};i.media.audioOwner==="parent"&&(a&&d?i.media.pauseAll():!a&&!d&&i.media.playAll(),i.media.mirrorTime(s));const p=performance.now(),h=d!==t.paused;return(p-t.lastUpdateMs>De||h)&&(m.lastUpdateMs=p,i.updateControlsTime(s,t.duration),i.updateControlsPlaying(!d),i.dispatchEvent(new CustomEvent("timeupdate",{detail:{currentTime:s}}))),u&&(i.media.audioOwner==="parent"&&i.media.pauseAll(),m.paused=!0,i.updateControlsPlaying(!1),i.dispatchEvent(new Event("ended"))),m}const oe=30;function Fe(n,e,t){if(n.source!==e)return;const i=n.data;if(!(!i||i.source!=="hf-preview")){if(i.type==="shader-transition-state"){const r=i.state&&typeof i.state=="object"?i.state:{};t.shaderLoader.update(r,t.getShaderLoadingMode()),t.dispatchEvent(new CustomEvent("shadertransitionstate",{detail:{compositionId:i.compositionId,state:r}}));return}if(i.type==="state"){t.setPlaybackState(Ne({frame:i.frame??0,isPlaying:!!i.isPlaying},oe,t.getPlaybackState(),t));return}if(i.type==="media-autoplay-blocked"){let r=null;try{r=t.getIframeDoc()}catch{}t.media.promoteToParentProxy(r,(s,a)=>t.media.mirrorTime(s,a)),t.sendControl("set-media-output-muted",{muted:!0});return}if(i.type==="timeline"&&i.durationInFrames>0){if(Number.isFinite(i.durationInFrames)){const r=t.getPlaybackState(),s=i.durationInFrames/oe;t.setPlaybackState({...r,duration:s}),t.updateControlsTime(r.currentTime,s)}return}i.type==="stage-size"&&i.width>0&&i.height>0&&t.setCompositionSize(i.width,i.height)}}const C="shader-capture-scale",k="shader-loading",Ue="__hf_shader_capture_scale",Ve="__hf_shader_loading",O=["Preparing scene transitions","Sampling outgoing scene motion","Sampling incoming scene motion","Caching transition frames","Finalizing transition preview"];function H(n){if(n===null)return null;const e=Number(n);return!Number.isFinite(e)||e<=0?null:String(Math.min(1,Math.max(.25,e)))}function He(n){if(n===null||n.trim()==="")return"composition";const e=n.trim().toLowerCase();return e==="none"||e==="false"||e==="0"||e==="off"?"none":e==="player"||e==="true"||e==="1"||e==="on"?"player":"composition"}function ae(n,e,t){t===null?n.delete(e):n.set(e,t)}function $e(n,e,t){const i=n.indexOf("#"),r=i>=0?n.slice(0,i):n,s=i>=0?n.slice(i):"",a=r.indexOf("?"),d=a>=0?r.slice(0,a):r,u=a>=0?r.slice(a+1):"",m=new URLSearchParams(u);ae(m,Ue,e),ae(m,Ve,t==="composition"?null:t);const p=m.toString();return`${d}${p?`?${p}`:""}${s}`}function ze(n,e,t){if(e===null&&t==="composition")return n;const i=[];e!==null&&i.push(`window.__HF_SHADER_CAPTURE_SCALE=${JSON.stringify(e)};`),t!=="composition"&&i.push(`window.__HF_SHADER_LOADING=${JSON.stringify(t)};`);const r=`<script data-hyperframes-player-shader-options>${i.join("")}<\/script>`;return/<head\b[^>]*>/i.test(n)?n.replace(/<head\b[^>]*>/i,s=>`${s}${r}`):/<html\b[^>]*>/i.test(n)?n.replace(/<html\b[^>]*>/i,s=>`${s}${r}`):`${r}${n}`}function S(n){return He(n.getAttribute(k))}function je(n){return Number(H(n.getAttribute(C))??"1")}function F(n,e){return $e(e,H(n.getAttribute(C)),S(n))}function U(n,e){return ze(e,H(n.getAttribute(C)),S(n))}function qe(){const n=document.createElement("div");n.className="hfp-shader-loader",n.setAttribute("role","status"),n.setAttribute("aria-live","polite"),n.setAttribute("aria-label","Preparing scene transitions"),n.setAttribute("data-hyperframes-ignore",""),n.draggable=!1;const e=f=>{f.preventDefault(),f.stopPropagation()};for(const f of["selectstart","dragstart","pointerdown","mousedown","click","dblclick","contextmenu","touchstart"])n.addEventListener(f,e,{capture:!0});const t=document.createElement("div");t.className="hfp-shader-loader-panel",t.draggable=!1;const i=document.createElement("div");i.className="hfp-shader-loader-mark",i.draggable=!1,i.innerHTML=['<svg width="78" height="78" viewBox="0 0 100 100" fill="none" aria-hidden="true" draggable="false">','<path d="M10.1851 57.8021L33.1145 73.8313C36.2202 75.9978 41.5173 73.5433 42.4816 69.4984L51.7611 30.4271C52.7253 26.3822 48.5802 23.9277 44.4602 26.0942L13.917 42.1235C6.96677 45.7676 4.97564 54.1579 10.1851 57.8021Z" fill="url(#hfp-shader-loader-grad-left)"/>','<path d="M87.5129 57.5141L56.9696 73.5433C52.8371 75.7098 48.7046 73.2553 49.6688 69.2104L58.9483 30.1391C59.9125 26.0942 65.2097 23.6397 68.3154 25.8062L91.2447 41.8354C96.4668 45.4796 94.4631 53.8699 87.5129 57.5141Z" fill="url(#hfp-shader-loader-grad-right)"/>',"<defs>",'<linearGradient id="hfp-shader-loader-grad-left" x1="48.5676" y1="25" x2="44.7804" y2="71.9384" gradientUnits="userSpaceOnUse">','<stop stop-color="#06E3FA"/>','<stop offset="1" stop-color="#4FDB5E"/>',"</linearGradient>",'<linearGradient id="hfp-shader-loader-grad-right" x1="54.8282" y1="73.8392" x2="72.0989" y2="32.8932" gradientUnits="userSpaceOnUse">','<stop stop-color="#06E3FA"/>','<stop offset="1" stop-color="#4FDB5E"/>',"</linearGradient>","</defs>","</svg>"].join("");const r=document.createElement("div");r.className="hfp-shader-loader-title";const s=document.createElement("span");s.className="hfp-shader-loader-title-text",s.textContent=O[0],r.appendChild(s);const a=document.createElement("div");a.className="hfp-shader-loader-detail",a.textContent="Rendering animated scene samples for shader transitions.";const d=document.createElement("div");d.className="hfp-shader-loader-track",d.setAttribute("aria-hidden","true");const u=document.createElement("div");u.className="hfp-shader-loader-fill",d.appendChild(u);const m=document.createElement("div");m.className="hfp-shader-loader-progress";const p=f=>{const g=document.createElement("div");g.className="hfp-shader-loader-row";const _=document.createElement("span");_.className="hfp-shader-loader-label",_.textContent=f;const y=document.createElement("span");return y.className="hfp-shader-loader-value",g.appendChild(_),g.appendChild(y),m.appendChild(g),{row:g,label:_,value:y}},h=p("transition"),b=p("transition frame");return t.appendChild(i),t.appendChild(r),t.appendChild(a),t.appendChild(d),t.appendChild(m),n.appendChild(t),{root:n,fill:u,title:s,detail:a,transitionValue:h.value,frameLabel:b.label,frameValue:b.value,frameRow:b.row}}const Be=420;class We{constructor(e){c(this,"_el");c(this,"_hideTimeout",null);this._el=e}show(){this._hideTimeout&&(clearTimeout(this._hideTimeout),this._hideTimeout=null),this._el.root.classList.remove("hfp-hiding"),this._el.root.classList.add("hfp-visible")}hide(){if(this._el.root.classList.contains("hfp-hiding")){this._hideTimeout||this._scheduleCleanup();return}this._el.root.classList.contains("hfp-visible")&&(this._el.root.classList.add("hfp-hiding"),this._el.root.classList.remove("hfp-visible"),this._scheduleCleanup())}reset(){this._hideTimeout&&(clearTimeout(this._hideTimeout),this._hideTimeout=null),this._el.root.classList.remove("hfp-visible","hfp-hiding"),this._el.fill.style.transform="scaleX(0)",this._el.transitionValue.textContent="",this._el.frameValue.textContent="",this._el.frameRow.style.visibility="hidden"}update(e,t){if(t!=="player"){this.reset();return}if(e.ready||!e.loading){this.hide();return}const i=typeof e.progress=="number"&&Number.isFinite(e.progress)?e.progress:0,r=typeof e.total=="number"&&Number.isFinite(e.total)?e.total:0,s=r>0?Math.min(1,Math.max(0,i/r)):0,a=Math.min(O.length-1,Math.floor(s*O.length));this._el.title.textContent=O[a]||"Preparing scene transitions",this._el.detail.textContent=e.phase==="cached"?"Loading cached transition frames before playback.":e.phase==="finalizing"?"Uploading transition textures for smooth playback.":"Rendering animated scene samples for shader transitions.",this._el.fill.style.transform=`scaleX(${s})`,this._el.transitionValue.textContent=e.currentTransition!==void 0&&e.transitionTotal!==void 0?`${e.currentTransition}/${e.transitionTotal}`:r>0?`${i}/${r}`:"";const d=e.transitionFrame!==void 0&&e.transitionFrames!==void 0?`${e.transitionFrame}/${e.transitionFrames}`:"";this._el.frameLabel.textContent=e.phase==="cached"?"cached transition frames":e.phase==="finalizing"?"finalizing transition frames":"rendering transition frames",this._el.frameValue.textContent=d,this._el.frameRow.style.visibility=d?"visible":"hidden",this._el.root.setAttribute("aria-valuenow",String(Math.round(s*100))),this.show()}get hideTimeout(){return this._hideTimeout}destroy(){this._hideTimeout&&(clearTimeout(this._hideTimeout),this._hideTimeout=null)}_scheduleCleanup(){this._hideTimeout&&clearTimeout(this._hideTimeout),this._hideTimeout=setTimeout(()=>{this._el.root.classList.remove("hfp-hiding"),this._hideTimeout=null},Be)}}const Xe=.1,Ge=5;function V(n){return!Number.isFinite(n)||n<=0?1:Math.max(Xe,Math.min(Ge,n))}class Ye extends HTMLElement{constructor(){super();c(this,"shadow");c(this,"container");c(this,"iframe");c(this,"posterEl",null);c(this,"controlsApi",null);c(this,"resizeObserver");c(this,"shaderLoader");c(this,"probe");c(this,"_ready",!1);c(this,"_currentTime",0);c(this,"_duration",0);c(this,"_paused",!0);c(this,"_lastUpdateMs",0);c(this,"_volume",1);c(this,"_compositionWidth",1920);c(this,"_compositionHeight",1080);c(this,"_directTimelineAdapter",null);c(this,"_directTimelineClock");c(this,"_parentTickRaf",null);c(this,"_media");this.shadow=this.attachShadow({mode:"open"}),Te(this.shadow,ge),{container:this.container,iframe:this.iframe}=Ce(),this.shadow.appendChild(this.container);const t=qe();this.shadow.appendChild(t.root),this.shaderLoader=new We(t),this._media=new Oe({dispatchEvent:i=>this.dispatchEvent(i),getMuted:()=>this.muted,getVolume:()=>this._volume,getPlaybackRate:()=>this.playbackRate,getCurrentTime:()=>this._currentTime,isPaused:()=>this._paused}),this._directTimelineClock=new Se({onTimeUpdate:(i,r)=>{var s;this._currentTime=i,(s=this.controlsApi)==null||s.updateTime(i,r),this.dispatchEvent(new CustomEvent("timeupdate",{detail:{currentTime:i}}))},getLoop:()=>this.loop,restart:()=>{this.seek(0),this.play()},onPaused:()=>{var i;this._media.audioOwner==="parent"&&this._media.pauseAll(),this._paused=!0,(i=this.controlsApi)==null||i.updatePlaying(!1),this.dispatchEvent(new Event("ended"))},onEnded:()=>this.loop}),this.probe=new _e(this.iframe,{onReady:i=>this._onProbeReady(i),onError:i=>this.dispatchEvent(new CustomEvent("error",{detail:{message:i}}))}),this.addEventListener("click",i=>{Ee(i)||(this._paused?this.play():this.pause())}),this.resizeObserver=new ResizeObserver(()=>this._rescale()),this._onMessage=this._onMessage.bind(this),this._onIframeLoad=this._onIframeLoad.bind(this)}static get observedAttributes(){return["src","srcdoc","width","height","controls","muted","volume","poster","playback-rate","audio-src",C,k]}connectedCallback(){this.resizeObserver.observe(this),window.addEventListener("message",this._onMessage),this.iframe.addEventListener("load",this._onIframeLoad),this.hasAttribute("controls")&&this._setupControls(),this.hasAttribute("poster")&&(this.posterEl=se(this.shadow,this.getAttribute("poster"),this.posterEl)),this.hasAttribute("audio-src")&&this._media.setupFromUrl(this.getAttribute("audio-src")),this.hasAttribute("srcdoc")&&(this.iframe.srcdoc=U(this,this.getAttribute("srcdoc"))),this.hasAttribute("src")&&(this.iframe.src=F(this,this.getAttribute("src")))}disconnectedCallback(){var t;this.resizeObserver.disconnect(),window.removeEventListener("message",this._onMessage),this.iframe.removeEventListener("load",this._onIframeLoad),this.probe.stop(),this._directTimelineClock.stop(),this._stopParentTickClock(),this._directTimelineAdapter=null,this.shaderLoader.destroy(),this._media.destroy(),(t=this.controlsApi)==null||t.destroy()}attributeChangedCallback(t,i,r){var s,a,d,u,m,p;switch(t){case"src":r&&(this._ready=!1,this.iframe.src=F(this,r));break;case"srcdoc":this._ready=!1,r!==null?this.iframe.srcdoc=U(this,r):this.iframe.removeAttribute("srcdoc");break;case"width":this._compositionWidth=parseInt(r||"1920",10),this._rescale();break;case"height":this._compositionHeight=parseInt(r||"1080",10),this._rescale();break;case"controls":r!==null?this._setupControls():((s=this.controlsApi)==null||s.destroy(),this.controlsApi=null);break;case"poster":this.posterEl=se(this.shadow,r,this.posterEl);break;case"playback-rate":{const h=V(parseFloat(r||"1"));this._media.updatePlaybackRate(h),this._sendControl("set-playback-rate",{playbackRate:h}),(d=(a=this._directTimelineAdapter)==null?void 0:a.timeScale)==null||d.call(a,h),(u=this.controlsApi)==null||u.updateSpeed(h),this.dispatchEvent(new Event("ratechange"));break}case"muted":this._media.updateMuted(r!==null),this._sendControl("set-muted",{muted:r!==null}),(m=this.controlsApi)==null||m.updateMuted(r!==null),this.dispatchEvent(new Event("volumechange"));break;case"volume":{const h=Math.max(0,Math.min(1,parseFloat(r||"1")));this._volume=h,this._media.updateVolume(h),this._sendControl("set-volume",{volume:h}),(p=this.controlsApi)==null||p.updateVolume(h),this.dispatchEvent(new Event("volumechange"));break}case"audio-src":r&&this._media.setupFromUrl(r);break;case C:case k:this._reloadShaderOptions();break}}get iframeElement(){return this.iframe}play(){var i,r;(i=this.posterEl)==null||i.remove(),this.posterEl=null,this._duration>0&&this._currentTime>=this._duration&&this.seek(0),this._paused=!1;const t=this._tryDirectTimelinePlay();t||(this._sendControl("play"),this._ready&&!this._directTimelineAdapter&&this._startParentTickClock()),this._media.audioOwner==="parent"&&this._media.playAll(),(r=this.controlsApi)==null||r.updatePlaying(!0),this.dispatchEvent(new Event("play")),t&&this._directTimelineAdapter&&this._directTimelineClock.start(this._directTimelineAdapter,()=>this._currentTime,()=>this._duration,()=>this._paused)}pause(){var t;this._tryDirectTimelinePause()||this._sendControl("pause"),this._directTimelineClock.stop(),this._stopParentTickClock(),this._media.audioOwner==="parent"&&this._media.pauseAll(),this._paused=!0,(t=this.controlsApi)==null||t.updatePlaying(!1),this.dispatchEvent(new Event("pause"))}seek(t){var i,r;!this._trySyncSeek(t)&&!this._tryDirectTimelineSeek(t)&&this._sendControl("seek",{frame:Math.round(t*30)}),this._directTimelineClock.stop(),this._stopParentTickClock(),this._currentTime=t,this._media.audioOwner==="parent"&&(this._media.pauseAll(),this._media.seekAll(t)),this._paused=!0,(i=this.controlsApi)==null||i.updatePlaying(!1),(r=this.controlsApi)==null||r.updateTime(this._currentTime,this._duration)}get currentTime(){return this._currentTime}set currentTime(t){this.seek(t)}get duration(){return this._duration}get paused(){return this._paused}get ready(){return this._ready}get playbackRate(){return V(parseFloat(this.getAttribute("playback-rate")||"1"))}set playbackRate(t){this.setAttribute("playback-rate",String(V(t)))}get shaderCaptureScale(){return je(this)}set shaderCaptureScale(t){this.setAttribute(C,String(t))}get shaderLoading(){return S(this)}set shaderLoading(t){t==="composition"?this.removeAttribute(k):this.setAttribute(k,t)}get muted(){return this.hasAttribute("muted")}set muted(t){t?this.setAttribute("muted",""):this.removeAttribute("muted")}get volume(){return this._volume}set volume(t){this.setAttribute("volume",String(Math.max(0,Math.min(1,t))))}get loop(){return this.hasAttribute("loop")}set loop(t){t?this.setAttribute("loop",""):this.removeAttribute("loop")}_sendControl(t,i={}){var r;try{(r=this.iframe.contentWindow)==null||r.postMessage({source:"hf-parent",type:"control",action:t,...i},"*")}catch{}}_reloadShaderOptions(){if(S(this)!=="player"&&this.shaderLoader.reset(),this.hasAttribute("srcdoc")){this.iframe.srcdoc=U(this,this.getAttribute("srcdoc")||"");return}this.hasAttribute("src")&&(this.iframe.src=F(this,this.getAttribute("src")||""))}_trySyncSeek(t){try{const i=this.iframe.contentWindow,r=i==null?void 0:i.__player;return typeof(r==null?void 0:r.seek)!="function"?!1:(r.seek.call(r,t),!0)}catch{return!1}}_withDirectTimeline(t){const i=this._directTimelineAdapter||this.probe.resolveDirectTimelineAdapter();if(!i)return!1;try{return t(i),this._directTimelineAdapter=i,!0}catch{return!1}}_tryDirectTimelineSeek(t){return this._withDirectTimeline(i=>{i.seek(t),i.pause()})}_tryDirectTimelinePlay(){return this._withDirectTimeline(t=>void t.play())}_tryDirectTimelinePause(){return this._withDirectTimeline(t=>void t.pause())}_startParentTickClock(){this._stopParentTickClock();const t=()=>{if(this._paused){this._parentTickRaf=null;return}this._sendControl("tick"),this._parentTickRaf=requestAnimationFrame(t)};this._parentTickRaf=requestAnimationFrame(t)}_stopParentTickClock(){this._parentTickRaf!==null&&(cancelAnimationFrame(this._parentTickRaf),this._parentTickRaf=null)}_onMessage(t){Fe(t,this.iframe.contentWindow,{getPlaybackState:()=>({currentTime:this._currentTime,duration:this._duration,paused:this._paused,lastUpdateMs:this._lastUpdateMs}),setPlaybackState:({currentTime:i,duration:r,paused:s,lastUpdateMs:a})=>{this._currentTime=i,this._duration=r,this._paused=s,this._lastUpdateMs=a},getShaderLoadingMode:()=>S(this),shaderLoader:this.shaderLoader,setCompositionSize:(i,r)=>{this._compositionWidth=i,this._compositionHeight=r,this._rescale()},sendControl:(i,r)=>this._sendControl(i,r),getIframeDoc:()=>this.iframe.contentDocument,updateControlsTime:(i,r)=>{var s;return(s=this.controlsApi)==null?void 0:s.updateTime(i,r)},updateControlsPlaying:i=>{var r;return(r=this.controlsApi)==null?void 0:r.updatePlaying(i)},dispatchEvent:i=>this.dispatchEvent(i),seek:i=>this.seek(i),play:()=>this.play(),getLoop:()=>this.loop,media:this._media})}_onProbeReady({duration:t,adapter:i,compositionSize:r}){var s;this._duration=t,this._directTimelineAdapter=i.kind==="direct-timeline"?i.timeline:null,this._ready=!0,(s=this.controlsApi)==null||s.updateTime(0,t),this.dispatchEvent(new CustomEvent("ready",{detail:{duration:t}})),r&&(this._compositionWidth=r.width,this._compositionHeight=r.height,this._rescale());try{const a=this.iframe.contentDocument;a&&this._media.setupFromIframe(a)}catch{}this.hasAttribute("autoplay")&&this.play()}_rescale(){xe(this,this.iframe,this._compositionWidth,this._compositionHeight)}_onIframeLoad(){this._directTimelineAdapter=null,this._directTimelineClock.stop(),this._stopParentTickClock(),this.shaderLoader.reset(),this._media.resetForIframeLoad(),this.probe.start()}_setupControls(){this.controlsApi||(this.controlsApi=Ae(this.shadow,this.muted,this._volume,this.getAttribute("speed-presets"),{onPlay:()=>this.play(),onPause:()=>this.pause(),onSeek:t=>this.seek(t*this._duration),onSpeedChange:t=>void(this.playbackRate=t),onMuteToggle:()=>void(this.muted=!this.muted),onVolumeChange:t=>void(this.volume=t)}))}get _audioOwner(){return this._media.audioOwner}get _parentMedia(){return this._media.entries}_mirrorParentMediaTime(t,i){this._media.mirrorTime(t,i)}_promoteToParentProxy(){let t=null;try{t=this.iframe.contentDocument}catch{}this._media.promoteToParentProxy(t,(i,r)=>this._mirrorParentMediaTime(i,r)),this._sendControl("set-media-output-muted",{muted:!0})}_observeDynamicMedia(t){this._media.setupFromIframe(t)}}customElements.get("hyperframes-player")||customElements.define("hyperframes-player",Ye);export{Ye as HyperframesPlayer,ye as SPEED_PRESETS,N as formatSpeed,ne as formatTime};
