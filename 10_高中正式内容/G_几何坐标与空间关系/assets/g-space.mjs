import {spaceSVG} from './g-space-models.mjs?v=20261124-distance-foot';
import {vectorSVG,lineCoordinateExample} from './g-vector-models.mjs?v=20261125-perpendicular-conditions';
for(const host of document.querySelectorAll('[data-space]')){
 const view=host.querySelector('.space-view'),fallback=host.querySelector('.space-static'),controls=host.querySelector('.g-controls'),status=host.querySelector('.space-status'),range=host.querySelector('input');
 const live=document.createElement('div');live.className='space-live';live.tabIndex=0;live.setAttribute('role','group');live.setAttribute('aria-label',host.dataset.label+'；拖动或用方向键旋转');view.append(live);
 const coefficients=controls.querySelectorAll('[data-coefficient]');
 const originButton=controls.querySelector('[data-reference-point]');
 const parameter=range?.dataset.parameter;
 const initialYaw=Number(host.dataset.yaw??-.55),initialPitch=Number(host.dataset.pitch??.5);
 let yaw=initialYaw,pitch=initialPitch,frame=0,drag=null,state={collinear:false,angle:Number(host.dataset.angle||0),mode:0};
 if(parameter)state[parameter]=Number(range.defaultValue);
 function paint(){frame=0;try{live.innerHTML=(host.dataset.space.startsWith('vector-')?vectorSVG:spaceSVG)(host.dataset.space,state,yaw,pitch);fallback.hidden=true;host.dataset.state='ready';host.dataset.pose=[yaw,pitch,state.angle].join(',');}catch(e){live.hidden=true;fallback.hidden=false;controls.hidden=true;host.dataset.state='fallback';status.textContent='已保留静态图，关系说明见正文。';console.warn('G space fallback:',e.message);}}
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint);};
 function interpret(){
  controls.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.mode)===state.mode)));
  if(host.dataset.space==='three-points'){
   host.querySelector('[data-angle]').hidden=!state.collinear;
   host.querySelectorAll('[data-collinear]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.collinear==='true')===state.collinear)));
   status.textContent=state.collinear?'A、B、C 共线：平面绕这条直线转动，三点仍在面内，因而平面不唯一。':'A、B、C 不共线：三个点确定唯一平面。';
   host.querySelector('output').value=state.angle+'°';
  }else if(host.dataset.space==='parallel-angles'){
   status.textContent=['两组对应射线都同向：两个角都是 60°。','只有一组对应射线反向：两个角分别为 60°、120°，互补。','两组对应射线都反向：两个角仍都是 60°。'][state.mode];
  }else if(host.dataset.space==='parallel-plane-test'){
   status.textContent=state.mode?'a、b 互相平行，且都平行于 α；但 β 与 α 相交于 l。两条平行线不能代替两条相交线。':'a、b 在 β 内相交于 P，且都平行于 α，因此平面 β 与平面 α 平行。';
  }else if(host.dataset.space==='skew-angle'){
   status.textContent=state.mode?'O 换到 a 上的另一点，b′仍平行于 b；所取锐角 θ 不变。':'过 a 上的 O 作 b 的平行线 b′，把异面直线的角转为相交直线的角。';
  }else if(host.dataset.space==='normal-test'){
   status.textContent=state.mode?'a 与 b 平行，l 同时垂直于 a、b，却仍在 α 内。两条平行线不能用于这个判定。':'a、b 在 α 内相交，l 同时垂直于 a、b，因此 l 垂直于平面 α。';
  }else if(host.dataset.space==='point-distance'){
   host.querySelector('output').value=state.angle===100?'Q 与 H 重合':state.angle===0?'初始位置':'向 H 靠近';
   status.querySelector('[data-distance=oblique]').hidden=state.angle===100;
   status.querySelector('[data-distance=equal]').hidden=state.angle!==100;
  }else if(host.dataset.space==='line-plane-angle'||host.dataset.space==='dihedral-angle'){
   host.querySelector('output').value=state.angle+'°';
   const key=state.angle===0?'zero':state.angle===90?'right':state.angle===180?'flat':'general';
   status.querySelectorAll('[data-angle-state]').forEach(el=>{el.hidden=el.dataset.angleState!==key;});
  }else if(host.dataset.space==='perpendicular-planes-property'){
   status.querySelectorAll('[data-property-state]').forEach(el=>{el.hidden=Number(el.dataset.propertyState)!==state.mode;});
  }else if(host.dataset.space==='vector-projection'){
   host.querySelector('output').value=state.angle+'°';
   const key=state.angle===90?'zero':state.angle<90?'positive':'negative';
   status.querySelectorAll('[data-projection-state]').forEach(el=>{el.hidden=el.dataset.projectionState!==key;});
  }else if(parameter==='t'){
   const t=state.t,value=String(t);
   if(status.dataset.value!==value){
    const {displacement,end}=lineCoordinateExample(t);
    const signed=n=>String(n).replace('-','−');
    host.querySelector('output').value=signed(t);
    status.querySelectorAll('[data-component]').forEach((el,i)=>{el.textContent=signed(displacement[i]);});
    status.querySelector('[data-position]').textContent='('+end.map(signed).join(', ')+')';
    status.dataset.value=value;
   }
  }else if(originButton){
   for(const select of coefficients)select.value=String(state[select.dataset.coefficient]??1);
   originButton.setAttribute('aria-pressed',String(!!state.showOrigin));
   status.hidden=!state.showOrigin;
  }else if(host.dataset.space.startsWith('vector-')){
   status.querySelectorAll('[data-vector-state]').forEach(el=>{el.hidden=Number(el.dataset.vectorState)!==state.mode;});
  }else if(host.dataset.space==='lines-skew')status.textContent=Math.abs(yaw)<.01&&Math.abs(pitch)<.01?'正视图中的交叉来自前后重叠，两条直线并没有公共点。':'蓝、绿两线沿长方体的两条不共面棱延伸；两线不相交，也不平行。';
 }
 function rotate(dx,dy){yaw+=dx;pitch=Math.max(-1.4,Math.min(1.4,pitch+dy));interpret();schedule();}
 live.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};live.setPointerCapture(e.pointerId);live.classList.add('is-dragging');});
 live.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;rotate((e.clientX-drag.x)*.008,(e.clientY-drag.y)*.008);drag.x=e.clientX;drag.y=e.clientY;});
 const release=()=>{drag=null;live.classList.remove('is-dragging');};for(const type of ['pointerup','pointercancel','lostpointercapture'])live.addEventListener(type,release);
 live.addEventListener('keydown',e=>{const d={ArrowLeft:[-.18,0],ArrowRight:[.18,0],ArrowUp:[0,.15],ArrowDown:[0,-.15]}[e.key];if(d){e.preventDefault();rotate(...d);}});
 controls.querySelector('[data-reset]').addEventListener('click',()=>{
  yaw=initialYaw;pitch=initialPitch;
  state={collinear:false,angle:Number(host.dataset.angle||0),mode:0};
  if(range){
   range.value=parameter?range.defaultValue:state.angle;
   if(parameter)state[parameter]=Number(range.value);
  }
  interpret();schedule();
 });
 controls.querySelectorAll('[data-collinear]').forEach(b=>b.addEventListener('click',()=>{state.collinear=b.dataset.collinear==='true';state.angle=0;range.value=0;interpret();schedule();}));
 controls.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{state.mode=Number(b.dataset.mode);interpret();schedule();}));
 for(const select of coefficients)select.addEventListener('change',()=>{
  state[select.dataset.coefficient]=Number(select.value);
  interpret();schedule();
 });
 originButton?.addEventListener('click',()=>{state.showOrigin=!state.showOrigin;interpret();schedule();});
 range?.addEventListener('input',()=>{state[parameter||'angle']=Number(range.value);interpret();schedule();});
 controls.querySelector('[data-front]')?.addEventListener('click',()=>{yaw=0;pitch=0;interpret();schedule();});
 controls.querySelector('[data-oblique]')?.addEventListener('click',()=>{yaw=-.55;pitch=.5;interpret();schedule();});
 const observer=new IntersectionObserver(([e])=>{if(e.isIntersecting){schedule();observer.disconnect();}});observer.observe(view);
 controls.hidden=false;interpret();
 window.addEventListener('pagehide',()=>{observer.disconnect();cancelAnimationFrame(frame);},{once:true});
}
