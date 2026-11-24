import {sphereModel} from './g-sphere-models.mjs?v=20261104-sphere';
import {motionModel} from './g-measure-motion-models.mjs?v=20261104-unfold-r2';
// Shared coordinates keep printable diagrams and draggable views identical.
export const palette={side:'#80b3c3',base:'#8bb7a2',cut:'#dfaa68',ink:'#244855',purple:'#aa98be'};
const {side,base,cut}=palette;
const add=(a,b)=>a.map((v,i)=>v+b[i]);
export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
export function faceArea(p){let a=0;for(let i=1;i<p.length-1;i++)a+=Math.hypot(...cross(sub(p[i],p[0]),sub(p[i+1],p[0])))/2;return a;}
function face(p,color=side,edge=true){return {p,color,edge};}
function box(x=0,contact=0){
 const v=[[-1,0,-.5],[1,0,-.5],[1,0,.5],[-1,0,.5],[-1,1,-.5],[1,1,-.5],[1,1,.5],[-1,1,.5]].map(p=>add(p,[x,-.5,0]));
 return [[0,3,2,1],[4,5,6,7],[0,1,5,4],[3,7,6,2],[0,4,7,3],[1,2,6,5]].map((f,i)=>({...face(f.map(j=>v[j]),(contact===-1&&i===4)||(contact===1&&i===5)?cut:i<2?base:side),group:x,sortCenter:[x,0,0]}));
}
export function netFaces(open=0){
 const t=open*Math.PI/2,s=Math.sin(t),c=Math.cos(t);
 const b=face([[-1,0,-.5],[1,0,-.5],[1,0,.5],[-1,0,.5]],base);
 return [b,
 face([[-1,0,-.5],[-1,0,.5],[-1-s,c,.5],[-1-s,c,-.5]]),
 face([[1,0,.5],[1,0,-.5],[1+s,c,-.5],[1+s,c,.5]]),
 face([[-1,0,.5],[1,0,.5],[1,c,.5+s],[-1,c,.5+s]]),
 face([[1,0,-.5],[-1,0,-.5],[-1,c,-.5-s],[1,c,-.5-s]]),
 face([[-1,c,-.5-s],[1,c,-.5-s],[1,c+Math.sin(2*t),-.5-s+Math.cos(2*t)],[-1,c+Math.sin(2*t),-.5-s+Math.cos(2*t)]],base)];
}
function round(rt,rb,h){
 const n=64,ring=(r,y)=>Array.from({length:n},(_,i)=>[r*Math.cos(i*2*Math.PI/n),y,r*Math.sin(i*2*Math.PI/n)]),lo=ring(rb,-h/2),hi=ring(rt,h/2),f=[];
 for(let i=0;i<n;i++){const j=(i+1)%n;f.push(face(rt?[lo[i],lo[j],hi[j],hi[i]]:[lo[i],lo[j],[0,h/2,0]],side,false));}
 f.push(face(lo.slice().reverse(),base));if(rt)f.push(face(hi,base));return f;
}
function pyramid(basePoints,tip,color=side,uniform=false){
 const center=tip.map((v,i)=>(v+basePoints.reduce((s,p)=>s+p[i],0))/5);
 return [face(basePoints,uniform?color:base),...basePoints.map((p,i)=>face([p,basePoints[(i+1)%basePoints.length],tip],color))].map(f=>{
  const n=cross(sub(f.p[1],f.p[0]),sub(f.p[2],f.p[0]));
  return {...f,p:dot(n,sub(f.p[0],center))<0?f.p.slice().reverse():f.p,cull:true};
 });
}
function sphere(half=false){
 const f=[],n=64,m=40,p=(a,b)=>[Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)];
 for(let j=half?m/2:0;j<m;j++)for(let i=0;i<n;i++){
 const a=j*Math.PI/m,b=i*2*Math.PI/n,c=(j+1)*Math.PI/m,d=(i+1)*2*Math.PI/n;
 f.push(face([p(a,b),p(c,b),p(c,d),p(a,d)],side,false));
 }
 if(half)f.push(face(Array.from({length:n},(_,i)=>p(Math.PI/2,i*2*Math.PI/n)),cut));return f;
}
export function model(kind,value=0){
 const sphereScene=sphereModel(kind,value);if(sphereScene)return sphereScene;
 const motion=motionModel(kind,value);if(motion)return motion;
 if(kind.startsWith('components-')){
  const shape=kind.slice(11),original=model(shape),n=64;
  const faces=original.faces.map((f,i)=>{
   if(i>=n)return {...f,p:f.p.map(([x,y,z])=>[x,y+(i===n?-.85:.85),z])};
   const normal=cross(sub(f.p[1],f.p[0]),sub(f.p[2],f.p[0]));
   return {...f,p:dot(normal,[f.p[0][0],0,f.p[0][2]])<0?f.p.slice().reverse():f.p,cull:true};
  });
  const h=shape==='cylinder'?2:shape==='cone'?Math.sqrt(3):Math.sqrt(3)/2;
  const rings=[[1,-h/2],...(shape==='cone'?[]:[[shape==='cylinder'?1:.5,h/2]])];
  const lines=rings.map(([r,y])=>({p:Array.from({length:97},(_,i)=>[r*Math.cos(i*Math.PI/48),y,r*Math.sin(i*Math.PI/48)]),color:'#355967'}));
  return {faces,lines,components:true,aria:({cylinder:'圆柱由一个侧面和两个相同的圆形底面组成',cone:'圆锥由一个侧面和一个圆形底面组成',frustum:'圆台由一个侧面和两个大小不同的圆形底面组成'})[shape]};
 }
 let f=[],lines=[],radius=1.8;
 if(kind==='net'){f=netFaces(value);radius=2.9;}
 if(kind==='glue'){f=[...box(-1-value,1),...box(1+value,-1)];radius=3.2;}
 if(kind==='cylinder')f=round(1,1,2);
 if(kind==='cone')f=round(0,1,Math.sqrt(3));
 if(kind==='frustum')f=round(.5,1,Math.sqrt(3)/2);
 if(kind==='prism'){f=box().map(q=>({...q,p:q.p.map(([x,y,z])=>[x,2*y,2*z])}));radius=2;}
 if(kind==='pyramid'){f=pyramid([[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]],[0,1,0]);radius=2;}
 if(kind==='six'){
  const faces=box().map(q=>q.p.map(([x,y,z])=>[x,2*y,2*z]));
  faces.forEach((p,i)=>{const center=p[0].map((_,k)=>p.reduce((s,q)=>s+q[k],0)/4),delta=center.map(x=>x*value*2);f.push(...pyramid(p,[0,0,0],[side,base,cut,palette.purple,'#95afb3','#b7ad8b'][i],true).map(q=>({...q,group:i,sortCenter:add(center.map(v=>v*.8),delta),p:q.p.map(v=>add(v,delta))})));});radius=2.9;
 }
 if(kind==='patch'){
  const y=Math.sqrt(.92),points=[[-.2,y,-.2],[.2,y,-.2],[.2,y,.2],[-.2,y,.2]];
  f=pyramid(points,[0,0,0],side);f[0].color=cut;
  lines.push({p:[[0,0,0],[0,y,0]],color:'#7651a8',dash:true});
 }
 if(kind==='sphere'||kind==='hemisphere'){
  f=sphere(kind==='hemisphere');radius=1.45;
  if(kind==='sphere'){
   // The great-circle back half is dashed, determined from the current view below.
   for(let i=0;i<96;i++){const a=i*Math.PI/48,b=(i+1)*Math.PI/48;lines.push({p:[[Math.cos(a),0,Math.sin(a)],[Math.cos(b),0,Math.sin(b)]],color:'#24664e',surface:true});}
  }
 }
 if(!f.length)throw new Error('Unknown measurement model: '+kind);
 return {faces:f,lines,radius};
}
export function project(p,yaw=-.55,pitch=.4){const c=Math.cos(yaw),s=Math.sin(yaw),x=p[0]*c+p[2]*s,z=-p[0]*s+p[2]*c;return [x,p[1]*Math.cos(pitch)-z*Math.sin(pitch),p[1]*Math.sin(pitch)+z*Math.cos(pitch)];}
function shade(color,n){const length=Math.hypot(...n)||1,facing=n[2]<0?n.map(v=>-v):n,light=.68+.32*Math.max(0,dot(facing,[.3,.7,.64])/length);return '#'+color.slice(1).match(/../g).map(h=>Math.round(parseInt(h,16)*light).toString(16).padStart(2,'0')).join('');}
export function modelSVG(kind,value=0,yaw=-.55,pitch=.4){
 const scene=model(kind,value);
 // Keep the closed cone upright; the same rigid frame eases into the flat net.
 if(scene.unfold&&kind!=='unfold-cylinder'){
  const angle=-Math.PI/6*(1-scene.open),c=Math.cos(angle),s=Math.sin(angle);
  const turn=([x,y,z])=>[x,y*c-z*s,y*s+z*c];
  scene.faces=scene.faces.map(f=>({...f,p:f.p.map(turn)}));
  scene.lines=scene.lines.map(l=>({...l,p:l.p.map(turn)}));
  scene.labels=scene.labels.map(l=>({...l,p:turn(l.p)}));
 }
 const {faces,lines,labels=[]}=scene;
 // The default view settles onto the completed net; user rotation remains additive.
 if(scene.unfold){yaw+=.55*scene.open;pitch-=.4*scene.open;}
 const points=[...faces.flatMap(f=>f.p),...(labels.length?lines.flatMap(l=>l.p):[])].map(p=>project(p,yaw,pitch));
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
 const scale=['prism','pyramid'].includes(kind)?86:Math.min((scene.aria?340:400)/(Math.max(...xs)-Math.min(...xs)),(scene.aria?250:270)/(Math.max(...ys)-Math.min(...ys)));
 const xy=p=>{const q=project(p,yaw,pitch);return [(240+(q[0]-cx)*scale).toFixed(2),(170-(q[1]-cy)*scale).toFixed(2)];};
 // Sort separate solids as units, so an internal face cannot paint over another shell.
 const sorted=faces.map(f=>({...f,z:f.p.reduce((s,p)=>s+project(p,yaw,pitch)[2],0)/f.p.length})).sort((a,b)=>a.group!==b.group&&a.sortCenter&&b.sortCenter?project(a.sortCenter,yaw,pitch)[2]-project(b.sortCenter,yaw,pitch)[2]:a.z-b.z);
 const body=sorted.map(f=>{const n=project(cross(sub(f.p[1],f.p[0]),sub(f.p[2],f.p[0])),yaw,pitch);if(f.cull&&n[2]<=0)return '';return `<polygon points="${f.p.map(xy).map(p=>p.join(',')).join(' ')}" fill="${shade(f.color,n)}" stroke="${f.edge?'#355967':shade(f.color,n)}" stroke-width="${f.edge?1.2:.45}" stroke-linejoin="round"/>`;}).join('');
 const projectedFaces=(scene.unfold||scene.components)?faces.map(f=>f.p.map(p=>project(p,yaw,pitch))):[];
 function obscured(p){
  const q=project(p,yaw,pitch);
  return projectedFaces.some(poly=>{
   const a=poly[0];
   for(let i=1;i<poly.length-1;i++){
    const b=poly[i],c=poly[i+1],d=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);
    if(Math.abs(d)<1e-10)continue;
    const u=((b[1]-c[1])*(q[0]-c[0])+(c[0]-b[0])*(q[1]-c[1]))/d;
    const v=((c[1]-a[1])*(q[0]-c[0])+(a[0]-c[0])*(q[1]-c[1]))/d,w=1-u-v;
    if(u>=-1e-6&&v>=-1e-6&&w>=-1e-6&&u*a[2]+v*b[2]+w*c[2]>q[2]+.008)return true;
   }
   return false;
  });
 }
 const visibleLines=(scene.unfold||scene.components)?lines.flatMap(l=>{
  if(l.p.length<3)return [l];
  const groups=[];
  for(let i=1;i<l.p.length;i++){
   const a=l.p[i-1],b=l.p[i],hidden=obscured(a.map((v,j)=>(v+b[j])/2));
   const last=groups.at(-1);
   if(last&&last.hidden===hidden)last.p.push(b);else groups.push({...l,p:[a,b],hidden,dash:l.dash||hidden});
  }
  return groups;
 }):lines;
 const guides=visibleLines.map(l=>{const back=l.surface&&project(l.p[0],yaw,pitch)[2]<0;return `${l.dash&&!scene.unfold&&!scene.components?`<polyline points="${l.p.map(xy).map(p=>p.join(',')).join(' ')}" fill="none" stroke="#f7f5ef" stroke-width="3.8" stroke-dasharray="4 4"/>`:''}<polyline points="${l.p.map(xy).map(p=>p.join(',')).join(' ')}" fill="none" stroke="${l.color}" stroke-width="1.6" ${l.dash||back?'stroke-dasharray="4 4"':''}/>`;}).join('');
 const annotations=labels.map(l=>{const p=xy(l.p),x=Number(p[0])+l.offset[0],y=Number(p[1])+l.offset[1];return `<text x="${x}" y="${y}" fill="${l.color}" text-anchor="middle" dominant-baseline="middle" font-size="16" font-family="Georgia,serif" font-style="${/[\u3400-\u9fff]/.test(l.text)?'normal':'italic'}">${l.text}</text>`;}).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${scene.aria?'40 0 400 340':'0 0 480 340'}" role="img" aria-label="${scene.aria||(kind==='net'?'长方体六个面的折叠与展开':kind==='glue'?'两个长方体沿橙色公共面拼接':'立体结构示意')}">${body}${guides}${annotations}</svg>`;
}
