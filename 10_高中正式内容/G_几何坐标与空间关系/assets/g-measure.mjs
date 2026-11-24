import {modelSVG} from './g-measure-models.mjs?v=20261104-sphere';
for(const host of document.querySelectorAll('[data-measure]')){
 const kind=host.dataset.measure,view=host.querySelector('.measure-view'),fallback=host.querySelector('.measure-static'),controls=host.querySelector('.g-controls'),range=host.querySelector('input'),output=host.querySelector('output');
 let yaw=-.55,pitch=.4,value=Number(range?.value||0),frame=0,drag=null,frames=0,animation=0;
 const play=host.querySelector('[data-play]'),status=host.querySelector('.measure-status');
 const unfold=kind.startsWith('unfold-');
 function interpret(){
  if(range){output.value=Math.round(value*100)+'%';range.setAttribute('aria-valuetext',output.value);}
  if(play)play.textContent=animation?'暂停':value>=1?(host.dataset.reverse||'合拢'):(host.dataset.action||'展开');
  const message=kind==='sphere-bands'?(value<.01?'同一颜色表示同高度的两条带；橙色突出其中一对。':'球面带与圆柱带逐条对应。间隙仅为观察而留，不计入原来的高度。'):kind==='sphere-pyramids'?(value<.01?'三角形底面拼成内接多面体；每个小棱锥的顶点都在球心。':'小棱锥沿径向分离，形状和体积不变；橙色标出下图观察的一个。'):unfold?(value<.01?'沿橙色虚线剪开，底面与侧面分别展开。':value<.24?'底面沿圆周剪开，向外翻开。':value<.995?'沿母线打开侧面，逐渐铺平；各部分面积不变。':'已铺平：蓝色是侧面，绿色是底面。尺寸与面积见图中标注。'):(kind==='pyramid-cut'?(value<.01?'大棱锥由下方棱台和上方小棱锥组成。':'移开顶部小棱锥，下面保留的部分就是棱台。'):kind==='six'?'六个全等四棱锥合成一个正方体；每个体积是正方体的六分之一。':kind==='prism-section'?'截面移动时，面积始终等于底面积 S。':'截面越接近顶点，面积越小；虚线保留完整棱锥的轮廓。');
  if(status&&status.textContent!==message)status.textContent=message;
 }
 function stop(){cancelAnimationFrame(animation);animation=0;interpret();}
 function setValue(v){value=v;if(range)range.value=String(v);interpret();schedule();}
 const live=document.createElement('div');live.className='measure-live';live.tabIndex=0;live.setAttribute('role','group');live.setAttribute('aria-label',host.dataset.label+'；拖动或用方向键旋转');view.append(live);
 function paint(){frame=0;try{const started=performance.now();live.innerHTML=modelSVG(kind,value,yaw,pitch);fallback.hidden=true;host.dataset.renderMs=(performance.now()-started).toFixed(1);host.dataset.frames=String(++frames);host.dataset.pose=[yaw,pitch,value].join(',');}catch(error){stop();live.hidden=true;fallback.hidden=false;controls.hidden=true;host.dataset.state='fallback';host.querySelector('.measure-hint').textContent='已保留静态图。';console.warn('G measurement fallback:',error.message);}}
 function schedule(){if(!frame)frame=requestAnimationFrame(paint);}
 function move(dx,dy){stop();yaw+=dx;pitch=Math.max(-1.45,Math.min(1.45,pitch+dy));schedule();}
 const observer=new IntersectionObserver(([e])=>{if(e.isIntersecting){schedule();observer.disconnect();}});observer.observe(view);
 live.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};live.setPointerCapture(e.pointerId);live.classList.add('is-dragging');});
 live.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;move((e.clientX-drag.x)*.009,(e.clientY-drag.y)*.009);drag.x=e.clientX;drag.y=e.clientY;});
 const release=()=>{drag=null;live.classList.remove('is-dragging');};live.addEventListener('pointerup',release);live.addEventListener('pointercancel',release);live.addEventListener('lostpointercapture',release);
 live.addEventListener('keydown',e=>{const dirs={ArrowLeft:[-.18,0],ArrowRight:[.18,0],ArrowUp:[0,.15],ArrowDown:[0,-.15]};if(dirs[e.key]){e.preventDefault();move(...dirs[e.key]);}});
 controls.querySelector('[data-reset]').addEventListener('click',()=>{stop();yaw=-.55;pitch=.4;setValue(Number(range?.defaultValue||0));});
 range?.addEventListener('input',()=>{stop();setValue(Number(range.value));});
 play?.addEventListener('click',()=>{
  if(animation){stop();return;}
  const from=value,to=value>=1?0:1;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){setValue(to);return;}
  const start=performance.now(),duration=(unfold?4400:2400)*Math.abs(to-from);
  function tick(now){const t=Math.min(1,(now-start)/duration);animation=t<1?requestAnimationFrame(tick):0;setValue(from+(to-from)*t);}
  animation=requestAnimationFrame(tick);interpret();
 });
 interpret();
 controls.hidden=false;host.dataset.state='ready';
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 window.addEventListener('pagehide',()=>{observer.disconnect();cancelAnimationFrame(frame);stop();},{once:true});
}
