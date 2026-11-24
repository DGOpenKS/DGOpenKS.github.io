import {names,polyhedron,view,cross,unit,project} from './g-geometry.js?v=20261031-combo-labels';
import {solidParts,wholeParts,isPolyhedron,sweepProfile,explodedParts} from './g-solid-parts.js?v=20261031-combo-labels';
const runtimeURL=new URL('../../../00_初高中衔接知识/chapter_02-2_立方相关公式/assets/vendor/three-r160/three.module.min.js',import.meta.url);
const right=unit([7,0,-5]),up=cross(view,right);
let runtime;
document.querySelectorAll('[data-solid-kind]').forEach(setup);
function anchor(p){
  if(p.points)return p.points[0].map((_,i)=>p.points.reduce((s,v)=>s+v[i],0)/p.points.length);
  if(p.type==='disk')return [0,p.y,0];
  if(p.type==='sphere')return [.8,.6,.55];
  const i=p.profile.findIndex((a,i)=>i>0&&a[1]!==p.profile[i-1][1]),a=p.profile[i-1],b=p.profile[i],radius=(a[0]+b[0])/2;return [radius*Math.SQRT1_2,(a[1]+b[1])/2,radius*Math.SQRT1_2];
}

function setup(host){
  const kind=host.dataset.solidKind,parts=host.hasAttribute('data-rotate-only')?[]:solidParts(kind),fallback=host.querySelector('.g-solid-static');
  const visual=document.createElement('div');visual.className='g-solid-visual';visual.style.cssText='position:relative;height:400px;overflow:hidden';host.prepend(visual);visual.append(fallback);
  const svg=fallback.querySelector('svg');svg.style.cssText='width:100%;height:100%;max-height:none';fallback.style.cssText='position:absolute;inset:0';
  // Replace the old printed callouts with keyboard-accessible labels at the same diagram.
  if(kind==='prism')svg.querySelectorAll('text').forEach(t=>{t.previousElementSibling?.classList.add('g-original-callout');t.classList.add('g-original-callout');});
  if(kind==='ball')svg.querySelectorAll('text').forEach(t=>t.classList.add('g-original-callout'));
  const links=document.createElementNS('http://www.w3.org/2000/svg','svg');links.classList.add('g-label-links');links.setAttribute('aria-hidden','true');
  const controls=document.createElement('div');controls.className='g-part-labels';controls.setAttribute('role','group');controls.setAttribute('aria-label',names[kind]+'的组成');
  for(const [i,p] of parts.entries()){const b=document.createElement('button');b.type='button';b.dataset.part=p.id;b.textContent=kind==='combo'?p.label.replace('部分',''):p.label.replace('棱（侧棱）','侧棱');if(kind==='combo')b.setAttribute('aria-label',p.label);b.setAttribute('aria-pressed','false');b.style.setProperty('--part-color','#'+p.color.toString(16));b.style[i%2?'left':'right']='12px';b.style.top=(18+Math.floor(i/2)*54)+'%';controls.append(b);const line=document.createElementNS(links.namespaceURI,'line');line.setAttribute('stroke','#'+p.color.toString(16));links.append(line);}
  const stage=document.createElement('div');stage.className='g-part-stage';stage.hidden=true;
  const toolbar=document.createElement('div');toolbar.className='g-part-toolbar';
  toolbar.innerHTML=`
    <button type="button" data-orbit="left" aria-label="左转" title="左转"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg></button>
    <button type="button" data-orbit="right" aria-label="右转" title="右转"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
    <button type="button" data-orbit="up" aria-label="俯视" title="俯视"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></button>
    <button type="button" data-orbit="down" aria-label="仰视" title="仰视"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14m-6-6 6 6 6-6"/></svg></button>
    <button type="button" data-restore aria-label="复位" title="复位"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v6h6M4 10a8 8 0 1 1 1 8"/></svg></button>`;
  const help=document.createElement('p');help.className='g-part-help';help.textContent=!parts.length?'拖动图形可旋转。':isPolyhedron(kind)?'点击名称展开，再点合拢；拖动旋转。':'拖动图形旋转，点击名称查看部件。';
  const idleNote=!parts.length?'':isPolyhedron(kind)?'当前：完整多面体。':'当前：完整立体。';
  const status=document.createElement('p');status.className='g-part-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.textContent=idleNote;status.hidden=!parts.length;controls.hidden=!parts.length;links.style.display=parts.length?'':'none';
  let range,output;
  if(['cylinder','cone','taper','ball'].includes(kind)){
    const label=document.createElement('label');label.className='g-sweep-control';label.append('生成旋转角 ');range=document.createElement('input');range.type='range';range.min='0';range.max='360';range.step='5';range.value='360';output=document.createElement('output');output.value='360°';label.append(range,output);toolbar.append(label);
  }
  stage.style.cssText='position:absolute;inset:0;width:100%;height:100%;overflow:hidden';if(kind==='combo'){stage.style.zIndex='0';links.style.zIndex='1';controls.style.zIndex='2';}visual.append(stage,links,controls);host.append(toolbar,help,status);
  const c={host,kind,parts,fallback,stage,controls,toolbar,help,status,idleNote,range,output,pinned:null,yaw:0,pitch:0,degrees:360,failed:false,ready:false};
  c.labels=points=>{
    const rect=visual.getBoundingClientRect();links.setAttribute('viewBox',`0 0 ${rect.width} ${rect.height}`);
    if(kind==='combo'){
      // Keep labels in the diagram's top/bottom gutters, clear of every orbit pose.
      [...controls.children].forEach((b,i)=>{
        const top=parts[i].id==='cone';b.style.top=(top?28:rect.height-28)+'px';b.style.left=top?'50%':i===0?'12px':'auto';b.style.right=top||i===0?'auto':'12px';b.style.transform=top?'translate(-50%,-50%)':'translateY(-50%)';
        const box=b.getBoundingClientRect(),line=links.children[i];line.setAttribute('x1',points[i][0]);line.setAttribute('y1',points[i][1]);line.setAttribute('x2',box.left+box.width/2-rect.left);line.setAttribute('y2',(top?box.bottom:box.top)-rect.top);
      });return;
    }
    for(const side of [0,1]){const rows=points.map((p,i)=>({i,y:Math.max(30,Math.min(rect.height-30,p[1]))})).filter(p=>p.i%2===side).sort((a,b)=>a.y-b.y);for(let j=1;j<rows.length;j++)rows[j].y=Math.max(rows[j].y,rows[j-1].y+52);if(rows.length&&rows.at(-1).y>rect.height-30){const overflow=rows.at(-1).y-(rect.height-30);rows.forEach(p=>p.y-=overflow);}rows.forEach(p=>controls.children[p.i].style.top=p.y+'px');}
    [...controls.children].forEach((b,i)=>{const box=b.getBoundingClientRect(),end=[i%2?box.right-rect.left:box.left-rect.left,box.top+box.height/2-rect.top],line=links.children[i];line.setAttribute('x1',points[i][0]);line.setAttribute('y1',points[i][1]);line.setAttribute('x2',end[0]);line.setAttribute('y2',end[1]);});
  };
  const staticLabels=()=>{const w=visual.clientWidth,h=visual.clientHeight,s=Math.min(w/480,h/340);c.labels(parts.map(p=>{const q=kind==='ball'&&p.id==='radius'?[240+1.15*70/2,170]:project(anchor(p));return [(w-480*s)/2+q[0]*s,(h-340*s)/2+q[1]*s];}));};
  c.staticLabels=staticLabels;
  const labelResize=new ResizeObserver(()=>{if(!c.ready)staticLabels();});labelResize.observe(visual);
  host.dataset.state='static';
  const desired=()=>c.pinned;
  c.paint=async()=>{
    if(c.failed)return;
    status.textContent='正在准备立体；原图仍可阅读。';
    try{
      const THREE=await (runtime??=import(runtimeURL.href));
      if(!c.ready){createView(c,THREE);c.ready=true;}
      c.update(desired());
    }catch(error){
      c.dispose?.();c.failed=true;host.dataset.state='fallback';
      status.hidden=false;status.textContent='当前不能显示三维交互，已保留静态图和正文。';controls.querySelectorAll('button').forEach(b=>b.disabled=true);toolbar.hidden=true;help.hidden=true;console.warn('G solid fallback:',error.message);
    }
  };
  const restoreFull=()=>{c.degrees=360;if(range){range.value='360';output.value='360°';}};
  controls.querySelectorAll('[data-part]').forEach(b=>{
    const p=parts.find(p=>p.id===b.dataset.part);
    b.addEventListener('click',()=>{c.pinned=c.pinned?.id===p.id?null:p;restoreFull();c.paint();});
  });
  toolbar.querySelectorAll('[data-orbit]').forEach(b=>b.addEventListener('click',()=>{
    const dir=b.dataset.orbit;if(dir==='left')c.yaw-=.25;if(dir==='right')c.yaw+=.25;if(dir==='up')c.pitch=Math.min(1.15,c.pitch+.18);if(dir==='down')c.pitch=Math.max(-1.15,c.pitch-.18);c.paint();
  }));
  toolbar.querySelector('[data-restore]').addEventListener('click',()=>{c.hover=c.focus=c.pinned=null;c.yaw=c.pitch=0;restoreFull();c.paint();});
  range?.addEventListener('input',()=>{c.pinned=c.hover=c.focus=null;c.degrees=Number(range.value);output.value=range.value+'°';c.paint();});
  const visible=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){visible.disconnect();c.paint();}});
  visible.observe(host);
  window.addEventListener('pagehide',()=>{visible.disconnect();labelResize.disconnect();c.dispose?.();},{once:true});
}

function createView(c,THREE){
  const {host,kind,stage,fallback,status,controls}=c;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);
  const canvas=renderer.domElement;canvas.style.cssText='display:block;width:100%;height:100%;touch-action:pan-y';canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',names[kind]+'，可拖动或用方向键旋转。'+(c.parts.length?'可点击表面选择部件。':''));if(!isPolyhedron(kind))canvas.style.touchAction='none';canvas.style.cursor='grab';stage.append(canvas);
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera();camera.position.set(...view.map(v=>v*10));camera.lookAt(0,0,0);camera.near=.1;camera.far=50;
  scene.add(new THREE.HemisphereLight(0xffffff,0x7d8b92,2));const lamp=new THREE.DirectionalLight(0xffffff,2);lamp.position.set(4,7,6);scene.add(lamp);
  const whole=new THREE.Group(),isolated=new THREE.Group(),guides=new THREE.Group();scene.add(whole,isolated,guides);
  let frame=0,disposed=false,selection=null,hitMeshes=[],poly=null;
  const roundRadius=isPolyhedron(kind)?0:Math.max(...sweepProfile(kind).map(([r,y])=>Math.hypot(r,y)));
  function addJointRim(){
    const points=Array.from({length:97},(_,i)=>[Math.cos(i*Math.PI/48),.25,Math.sin(i*Math.PI/48)]);
    const rim=new THREE.TorusGeometry(1,.008,8,96);rim.rotateX(Math.PI/2);rim.translate(0,.25,0);whole.add(new THREE.Mesh(rim,new THREE.MeshBasicMaterial({color:0xa35f18})));
    const hidden=new THREE.Line(pointsGeometry(points),new THREE.LineDashedMaterial({color:0xa35f18,dashSize:.06,gapSize:.05,depthFunc:THREE.GreaterDepth,transparent:true,opacity:.65}));hidden.computeLineDistances();whole.add(hidden);
  }
  function addRoundReferences(){
    const profile=sweepProfile(kind),ys=profile.map(p=>p[1]);
    const axis=new THREE.Line(pointsGeometry([[0,Math.min(...ys)-.2,0],[0,Math.max(...ys)+.2,0]]),new THREE.LineDashedMaterial({color:0x6f7885,dashSize:.07,gapSize:.06,transparent:true,opacity:.65,depthTest:false}));axis.computeLineDistances();whole.add(axis);
    if(kind==='ball'){
      for(const plane of ['xy','xz']){const points=Array.from({length:97},(_,i)=>{const a=i*Math.PI/48,r=1.154;return plane==='xy'?[r*Math.cos(a),r*Math.sin(a),0]:[r*Math.cos(a),0,r*Math.sin(a)];});whole.add(new THREE.Line(pointsGeometry(points),new THREE.LineBasicMaterial({color:0x376f64,transparent:true,opacity:.65})));}
    }
    for(const p of solidParts(kind).filter(p=>['line','point'].includes(p.type))){
      const mesh=addPart(whole,p);hitMeshes.push(mesh);
      if(p.type==='point'&&kind==='ball'){mesh.material.depthTest=false;mesh.renderOrder=2;}
      if(p.type==='line'){const hidden=new THREE.Line(pointsGeometry(p.points),new THREE.LineDashedMaterial({color:p.color,dashSize:.055,gapSize:.045,depthFunc:THREE.GreaterDepth,transparent:true,opacity:.75}));hidden.computeLineDistances();whole.add(hidden);}
    }
  }
  const discard=group=>{const gs=new Set(),ms=new Set();group.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>ms.add(m));});group.clear();gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());};
  const pointsGeometry=p=>new THREE.BufferGeometry().setFromPoints(p.map(v=>new THREE.Vector3(...v)));
  function geometry(p){
    if(p.type==='polygon'){const a=[];for(let i=1;i<p.points.length-1;i++)for(const v of [p.points[0],p.points[i],p.points[i+1]])a.push(...v);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a,3));g.computeVertexNormals();return g;}
    if(p.type==='lathe')return new THREE.LatheGeometry(p.profile.map(v=>new THREE.Vector2(...v)),64);
    if(p.type==='sphere')return new THREE.SphereGeometry(p.radius,48,32);
    if(p.type==='disk'){const g=new THREE.CircleGeometry(p.radius,64);g.rotateX(-Math.PI/2);g.translate(0,p.y,0);return g;}
    if(p.type==='point'){const g=new THREE.SphereGeometry(p.radius||.045,16,12);g.translate(...p.points[0]);return g;}
    // The thin tube only gives a line segment enough screen width to remain visible.
    const a=new THREE.Vector3(...p.points[0]),b=new THREE.Vector3(...p.points[1]),delta=b.clone().sub(a),g=new THREE.CylinderGeometry(.018,.018,delta.length(),10);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.clone().normalize()));g.translate(...a.add(b).multiplyScalar(.5).toArray());return g;
  }
  function addPart(group,p,ghost=false){
    const object=new THREE.Mesh(geometry(p),new THREE.MeshStandardMaterial({color:ghost?0xaebbc1:p.color,roughness:.85,metalness:0,side:THREE.DoubleSide,transparent:ghost,opacity:ghost?.2:1,depthWrite:!ghost,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}));object.userData={...p,meaning:p.label||p.id};group.add(object);
    if(['polygon','disk','lathe'].includes(p.type))group.add(new THREE.LineSegments(new THREE.EdgesGeometry(object.geometry,25),new THREE.LineBasicMaterial({color:ghost?0x93a4ad:c.parts.length?p.color:0x215b69,transparent:ghost,opacity:ghost?.55:1})));
    return object;
  }
  const worldPoints=group=>{group.updateMatrixWorld(true);const result=[];group.traverse(o=>{if(!o.geometry)return;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)result.push(new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));});return result;};
  const r=new THREE.Vector3(...right),u=new THREE.Vector3(...up);
  function bounds(points){let minR=Infinity,maxR=-Infinity,minU=Infinity,maxU=-Infinity;for(const p of points){const x=p.dot(r),y=p.dot(u);minR=Math.min(minR,x);maxR=Math.max(maxR,x);minU=Math.min(minU,y);maxU=Math.max(maxU,y);}return {minR,maxR,minU,maxU};}
  function fit(points){
    const b=bounds(points),aspect=stage.clientWidth/stage.clientHeight,space=c.parts.length?Math.max(.4,1-120/stage.clientWidth):1,half=Math.max((b.maxU-b.minU)/2+.25,((b.maxR-b.minR)/2+.25)/(aspect*space)),cx=(b.minR+b.maxR)/2,cy=(b.minU+b.maxU)/2;
    camera.left=cx-half*aspect;camera.right=cx+half*aspect;camera.bottom=cy-half;camera.top=cy+half;camera.updateProjectionMatrix();host.dataset.viewScale=half.toFixed(5);
  }
  function preparePoly(){
    const sets={},fitting=[];
    for(const category of ['face','edge','vertex']){
      const group=new THREE.Group(),parts=explodedParts(kind,category);whole.add(group);
      const items=parts.map(p=>{const piece=new THREE.Group();group.add(piece);const mesh=addPart(piece,p);mesh.userData.id=category;
        p.points.forEach(v=>{fitting.push(new THREE.Vector3(...v));if(c.parts.length)fitting.push(new THREE.Vector3(...v).add(new THREE.Vector3(...p.offset)));});
        return {p,piece,mesh,offset:new THREE.Vector3(...p.offset)};
      });sets[category]={group,items};
    }
    const edges=explodedParts(kind,'edge').flatMap(p=>p.points),reference=new THREE.LineSegments(pointsGeometry(edges),new THREE.LineBasicMaterial({color:0x8e9da4,transparent:true,opacity:0,depthWrite:false}));whole.add(reference);
    const hidden=new THREE.LineSegments(pointsGeometry(edges),new THREE.LineDashedMaterial({color:0x6e7a80,dashSize:.07,gapSize:.05,depthFunc:THREE.GreaterDepth,transparent:true}));hidden.computeLineDistances();whole.add(hidden);
    let extension;
    if(kind==='frustum'){const v=polyhedron(kind).vertices,pts=[];for(let i=4;i<8;i++)pts.push(v[i],[0,1.5,0]);extension=new THREE.LineSegments(pointsGeometry(pts),new THREE.LineDashedMaterial({color:0xa35f18,dashSize:.08,gapSize:.05,transparent:true}));extension.computeLineDistances();whole.add(extension);fitting.push(new THREE.Vector3(0,1.5,0));}
    poly={sets,fitting,reference,hidden,extension,family:'face',amount:0,target:'whole',motion:null};
  }
  function setPolyTarget(mode){
    if(!poly)preparePoly();if(poly.target===mode)return;
    poly.target=mode;
    const family=mode==='whole'?'face':mode,target=mode==='whole'?0:1;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){poly.family=family;poly.amount=target;poly.motion=null;return;}
    const fold=poly.family!==family&&poly.amount>.001;
    if(!fold)poly.family=family;
    poly.motion={start:performance.now(),from:poly.amount,to:fold?0:target,duration:fold?220:480,next:fold?{family,target}:null};
  }
  function positionPoly(now){
    const m=poly.motion;
    if(m){const t=Math.min(1,(now-m.start)/m.duration),e=t*t*(3-2*t);poly.amount=m.from+(m.to-m.from)*e;
      if(t===1){poly.motion=null;if(m.next){poly.family=m.next.family;poly.motion=m.next.target?{start:now,from:0,to:1,duration:480,next:null}:null;}}
    }
    whole.rotation.set(c.pitch,c.yaw,0);
    for(const [category,set] of Object.entries(poly.sets)){set.group.visible=category===poly.family;for(const item of set.items)item.piece.position.copy(item.offset).multiplyScalar(category===poly.family?poly.amount:0);}
    poly.reference.material.opacity=poly.amount*.32;whole.updateMatrixWorld(true);
    poly.hidden.material.opacity=poly.family==='face'?1-poly.amount:0;
    if(poly.extension)poly.extension.material.opacity=poly.family==='face'?1-poly.amount:0;
    fit(poly.fitting.map(p=>p.clone().applyEuler(whole.rotation)));
    hitMeshes=poly.sets[poly.family].items.map(i=>i.mesh);
    c.labels(c.parts.map(p=>{const base=new THREE.Vector3(...anchor(p)),items=poly.sets[p.id].items;let item=items[0],distance=Infinity;for(const candidate of items){const d=base.distanceToSquared(new THREE.Vector3(...anchor(candidate.p)));if(d<distance){item=candidate;distance=d;}}
      if(p.id===poly.family)base.addScaledVector(item.offset,poly.amount);base.applyEuler(whole.rotation).project(camera);return [(base.x+1)*stage.clientWidth/2,(1-base.y)*stage.clientHeight/2];}));
    host.dataset.category=poly.family;host.dataset.expansion=poly.amount.toFixed(4);host.dataset.explodedCount=String(poly.amount>0?poly.sets[poly.family].items.length:0);host.dataset.motion=poly.motion?'moving':'idle';
    host.dataset.offset=poly.amount>0?'radial':'0,0,0';
  }
  function position(){
    if(poly){positionPoly(performance.now());return;}
    whole.rotation.set(c.pitch,c.yaw,0);isolated.rotation.copy(whole.rotation);isolated.position.set(0,0,0);discard(guides);
    const original=selection?worldPoints(whole):[],before=selection?worldPoints(isolated):[],b=selection?bounds(original):null;
    if(before.length){
      const s=bounds(before),vertical=stage.clientWidth<500||selection?.type==='polygon'||selection?.type==='disk',offset=vertical?u.clone().multiplyScalar(b.maxU-s.minU+.55):r.clone().multiplyScalar(b.maxR-s.minR+.65);
      isolated.position.copy(offset);host.dataset.offset=offset.toArray().map(v=>v.toFixed(5)).join(',');
      const source=new THREE.Box3().setFromObject(isolated).getCenter(new THREE.Vector3()).sub(offset),target=source.clone().add(offset);
      const line=new THREE.Line(pointsGeometry([source.toArray(),target.toArray()]),new THREE.LineDashedMaterial({color:0x91a0aa,dashSize:.08,gapSize:.06,transparent:true,opacity:.8}));line.computeLineDistances();guides.add(line);
      const marker=new THREE.Mesh(new THREE.SphereGeometry(.035,12,8),new THREE.MeshBasicMaterial({color:selection.color,depthTest:false}));marker.position.copy(source);guides.add(marker);
    }else host.dataset.offset='0,0,0';
    const all=selection?bounds([...original,...worldPoints(isolated)]):{minR:-roundRadius,maxR:roundRadius,minU:-roundRadius,maxU:roundRadius},aspect=stage.clientWidth/stage.clientHeight,space=kind==='combo'?1:Math.max(.45,1-108/stage.clientWidth),heightSpace=kind==='combo'?1-80/stage.clientHeight:1,half=Math.max(((all.maxU-all.minU)/2+.2)/heightSpace,((all.maxR-all.minR)/2+.2)/(aspect*space)),cx=(all.minR+all.maxR)/2,cy=(all.minU+all.maxU)/2;
    camera.left=cx-half*aspect;camera.right=cx+half*aspect;camera.bottom=cy-half;camera.top=cy+half;camera.updateProjectionMatrix();host.dataset.viewScale=half.toFixed(5);
    c.labels(c.parts.map(p=>{const selected=p.id===selection?.id,point=new THREE.Vector3(...(kind==='combo'&&p.id==='joint'?[Math.SQRT1_2,.25,Math.SQRT1_2]:anchor(selected?selection:p))).applyEuler(whole.rotation);if(selected)point.add(isolated.position);point.project(camera);return [(point.x+1)*stage.clientWidth/2,(1-point.y)*stage.clientHeight/2];}));
  }
  const draw=()=>{if(disposed||frame)return;frame=requestAnimationFrame(()=>{frame=0;if(disposed)return;position();renderer.render(scene,camera);host.dataset.frames=String(Number(host.dataset.frames||0)+1);if(poly?.motion)draw();});};
  c.update=part=>{
    if(isPolyhedron(kind)){
      selection=part;setPolyTarget(part?.id||'whole');const count=part?poly.sets[part.id].items.length:0;
      status.textContent=part?`${count}${part.id==='edge'?'条':'个'}${part.label}已展开。${part.note}`:c.idleNote;
      controls.querySelectorAll('[data-part]').forEach(b=>b.setAttribute('aria-pressed',String(part?.id===b.dataset.part)));
      host.dataset.part=part?.id||'whole';host.dataset.pinned=part?.id||'';host.dataset.degrees='360';host.dataset.pose=`${c.yaw},${c.pitch}`;draw();return;
    }
    selection=part;discard(whole);discard(isolated);discard(guides);hitMeshes=[];
    if(c.degrees<360){
      const p=sweepProfile(kind),angle=c.degrees*Math.PI/180;
      if(c.degrees>0){const mesh=new THREE.Mesh(new THREE.LatheGeometry(p.map(v=>new THREE.Vector2(...v)),64,0,angle),new THREE.MeshStandardMaterial({color:0x80baa7,side:THREE.DoubleSide,roughness:.8}));mesh.userData={id:kind,meaning:names[kind],profile:p};whole.add(mesh);}
      const shape=new THREE.Shape(p.map(v=>new THREE.Vector2(...v)));shape.closePath();
      for(const a of c.degrees===0?[-Math.PI/2]:[-Math.PI/2,angle-Math.PI/2]){const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshStandardMaterial({color:0x478ba9,side:THREE.DoubleSide}));mesh.rotation.y=a;mesh.userData={id:'section',meaning:'生成区域或起止截面',profile:p};whole.add(mesh);}
      const axis=new THREE.Line(pointsGeometry([[0,-1.6,0],[0,1.6,0]]),new THREE.LineDashedMaterial({color:0x6f7885,dashSize:.08,gapSize:.06}));axis.computeLineDistances();whole.add(axis);
      const region={cylinder:'矩形',cone:'直角三角形',taper:'直角梯形',ball:'半圆区域'}[kind];status.textContent=c.degrees===0?`${region}尚未旋转，蓝色区域是生成区域。`:`${region}已绕轴旋转 ${c.degrees}°；蓝色为起止截面，还未形成完整的${names[kind]}。`;
    }else{
      for(const p of wholeParts(kind))hitMeshes.push(addPart(whole,p,!!part));
      if(!part)addRoundReferences();
      if(kind==='combo')addJointRim();
      if(!part&&isPolyhedron(kind)){
        const m=polyhedron(kind),pts=[],edges=new Set();for(const f of m.faces)for(let i=0;i<f.length;i++){const a=f[i],b=f[(i+1)%f.length],key=[a,b].sort().join(',');if(!edges.has(key)){edges.add(key);pts.push(m.vertices[a],m.vertices[b]);}}
        const hidden=new THREE.LineSegments(pointsGeometry(pts),new THREE.LineDashedMaterial({color:0x6e7a80,dashSize:.07,gapSize:.05,depthFunc:THREE.GreaterDepth}));hidden.computeLineDistances();whole.add(hidden);
      }
      if(kind==='frustum'&&!part){const v=polyhedron(kind).vertices,pts=[];for(let i=4;i<8;i++)pts.push(v[i],[0,1.5,0]);const lines=new THREE.LineSegments(pointsGeometry(pts),new THREE.LineDashedMaterial({color:0xa35f18,dashSize:.08,gapSize:.05}));lines.computeLineDistances();whole.add(lines);}
      if(part){addPart(isolated,part);const source=addPart(whole,part);source.material.transparent=true;source.material.opacity=['line','point'].includes(part.type)?1:.55;source.material.depthWrite=false;source.material.depthTest=false;status.textContent=`已选中：${part.label}。${part.note}`;}
      else status.textContent=c.idleNote;
    }
    controls.hidden=c.degrees<360;linksVisibility();controls.querySelectorAll('[data-part]').forEach(b=>{b.setAttribute('aria-pressed',String(c.pinned?.id===b.dataset.part));});
    host.dataset.part=part?.id||'whole';host.dataset.pinned=c.pinned?.id||'';host.dataset.degrees=String(c.degrees);host.dataset.pose=`${c.yaw},${c.pitch}`;draw();
  };
  function linksVisibility(){host.querySelector('.g-label-links').style.display=!c.parts.length||c.degrees<360?'none':'';}
  const resize=new ResizeObserver(()=>{if(stage.clientWidth&&stage.clientHeight){renderer.setSize(stage.clientWidth,stage.clientHeight,false);draw();}});
  stage.hidden=false;fallback.hidden=true;host.dataset.state='ready';renderer.setSize(stage.clientWidth,stage.clientHeight,false);resize.observe(stage);
  const lost=e=>{e.preventDefault();c.dispose();c.failed=true;host.dataset.state='fallback';status.hidden=false;status.textContent='三维显示已中断，已恢复静态图。';controls.querySelectorAll('button').forEach(b=>b.disabled=true);c.toolbar.hidden=true;};canvas.addEventListener('webglcontextlost',lost);
  c.dispose=()=>{
    if(disposed)return;disposed=true;cancelAnimationFrame(frame);resize.disconnect();canvas.removeEventListener('webglcontextlost',lost);discard(whole);discard(isolated);discard(guides);renderer.dispose();renderer.forceContextLoss();canvas.remove();stage.hidden=true;fallback.hidden=false;
    c.ready=false;c.pinned=null;c.yaw=c.pitch=0;c.degrees=360;if(c.range){c.range.value='360';c.output.value='360°';}controls.hidden=!c.parts.length;linksVisibility();controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));host.dataset.state='static';host.dataset.part='whole';host.dataset.pinned='';status.hidden=!c.parts.length;status.textContent=c.idleNote;c.staticLabels();
  };
  canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')c.yaw-=.15;if(e.key==='ArrowRight')c.yaw+=.15;if(e.key==='ArrowUp')c.pitch+=.1;if(e.key==='ArrowDown')c.pitch-=.1;c.pitch=Math.max(-1.15,Math.min(1.15,c.pitch));host.dataset.pose=`${c.yaw},${c.pitch}`;draw();});
  let drag;
  canvas.addEventListener('pointerdown',e=>{canvas.focus({preventScroll:true});drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';});
  canvas.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>5)drag.moved=true;if(!drag.moved)return;c.yaw+=(e.clientX-drag.x)*.008;if(e.pointerType==='mouse'||!isPolyhedron(kind))c.pitch=Math.max(-1.15,Math.min(1.15,c.pitch+(e.clientY-drag.y)*.006));drag.x=e.clientX;drag.y=e.clientY;host.dataset.pose=`${c.yaw},${c.pitch}`;draw();});
  canvas.addEventListener('pointerup',e=>{
    if(c.parts.length&&drag&&!drag.moved&&c.degrees===360){const rect=canvas.getBoundingClientRect(),ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=ray.intersectObjects(hitMeshes)[0];if(hit){const p=c.parts.find(p=>p.id===hit.object.userData.id);if(p){c.pinned=c.pinned?.id===p.id?null:p;c.update(c.pinned);}}}drag=null;canvas.style.cursor='grab';
  });
  for(const type of ['pointercancel','lostpointercapture','pointerleave'])canvas.addEventListener(type,()=>{drag=null;canvas.style.cursor='grab';});
}
