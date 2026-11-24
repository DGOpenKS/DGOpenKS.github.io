import {sub,dot,cross,center} from './g-geometry.js?v=20261031-combo-labels';
const add=(a,b)=>a.map((v,i)=>v+b[i]),mul=(a,t)=>a.map(v=>v*t);
export const colors={a:'#176b87',b:'#28785e',point:'#79539e',alpha:'#bdd5df',beta:'#c4ddce',l:'#79539e'};
const point=(id,p)=>({id,p,color:colors.point});
const line=(id,a,b,color=colors[id]||colors.a)=>({id,a,b,color});
function plane(id,o=[0,0,0],u=[1.4,0,0],v=[0,0,1]){
 const p=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>add(o,add(mul(u,a),mul(v,b))));
 return {id,o,u,v,p,n:cross(u,v),color:colors[id==='α'?'alpha':'beta'],label:add(o,add(mul(u,-.78),mul(v,.78)))};
}
export function spaceScene(kind,{collinear=false,angle=0,mode=0}={}){
 let planes=[plane('α')],lines=[],points=[];
 switch(kind){
 case 'symbols':
  lines=[line('l',[-1.85,0,0],[1.85,0,0])];points=[point('A',[-.55,0,0]),point('P',[.55,1.05,.2])];break;
 case 'three-points':{
  const t=collinear?angle*Math.PI/180:0;
  planes=[plane('α',[0,0,0],[1.4,0,0],[0,Math.sin(t),Math.cos(t)])];
  points=[point('A',[-1,0,0]),point('B',[1,0,0]),point('C',collinear?[.3,0,0]:[0,0,.85])];
  lines=collinear?[line('',[-1.7,0,0],[1.7,0,0],colors.a)]:[];break;
 }
 case 'contained':
  lines=[line('l',[-2,0,0],[2,0,0])];points=[point('A',[-.65,0,0]),point('B',[.65,0,0])];break;
 case 'line-point':
  lines=[line('l',[-1.7,0,-.2],[1.7,0,-.2])];points=[point('P',[0,0,.8])];break;
 case 'lines-meet':
  lines=[line('a',[-1.7,0,0],[1.7,0,0]),line('b',[-.7,0,-1.2],[.7,0,1.2])];points=[point('P',[0,0,0])];break;
 case 'lines-parallel':
  lines=[line('a',[-1.7,0,-.45],[1.7,0,-.45]),line('b',[-1.7,0,.45],[1.7,0,.45])];break;
 case 'lines-skew':{
  planes=[];
  const v=[[-1,-.7,1],[1,-.7,1],[1,-.7,-1],[-1,-.7,-1],[-1,.7,1],[1,.7,1],[1,.7,-1],[-1,.7,-1]];
  lines=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].map(([a,b])=>({...line('',v[a],v[b],'#a9b4b7'),guide:true}));
  lines.push(line('a',[-1.6,-.7,1],[1.6,-.7,1]),line('b',[1,-1.15,-1],[1,1.15,-1]));break;
 }
 case 'line-inside':lines=[line('a',[-1.8,0,.1],[1.8,0,.1])];break;
 case 'line-cross':lines=[line('a',[-.6,-1.15,.15],[.6,1.15,-.15])];points=[point('P',[0,0,0])];break;
 case 'line-parallel':lines=[line('a',[-1.75,.9,.1],[1.75,.9,.1])];break;
 case 'planes-meet':{
  planes=[plane('α'),plane('β',[0,0,0],[1.4,0,0],[0,1,0])];
  // Split each displayed patch along the real intersection before depth sorting.
  for(const f of planes){const m0=add(f.o,mul(f.u,-1)),m1=add(f.o,f.u);f.parts=[[f.p[0],f.p[1],m1,m0],[m0,m1,f.p[2],f.p[3]]];}
  lines=[line('l',[-1.85,0,0],[1.85,0,0],colors.l)];points=[point('P',[.35,0,0])];break;
 }
 case 'planes-parallel':planes=[plane('α',[0,-.45,0]),plane('β',[0,.65,0])];break;
 case 'parallel-transfer':
  planes=[];
  lines=[line('a',[-1.6,-.65,.55],[1.6,-.65,.55]),line('b',[-1.6,.1,-.55],[1.6,.1,-.55]),line('c',[-1.6,.95,.2],[1.6,.95,.2],colors.point)];break;
 case 'parallel-angles':{
  planes=[];
  const origins=[[-1,-.65,.5],[.8,.65,-.5]],theta=Math.PI/3;
  origins.forEach((o,i)=>{
   const a=i&&mode===2?Math.PI:0,b=theta+(i&&mode>0?Math.PI:0);
   const end=t=>add(o,[1.15*Math.cos(t),0,1.15*Math.sin(t)]);
   lines.push(line('',o,end(a),colors.a),line('',o,end(b),colors.b));
   points.push(point(i?'O′':'O',o),point(i?'A′':'A',end(a)),point(i?'B′':'B',end(b)));
   let delta=b-a;while(delta>Math.PI)delta-=2*Math.PI;
   for(let j=0;j<16;j++){
    const onArc=t=>add(o,[.32*Math.cos(t),0,.32*Math.sin(t)]);
    lines.push({...line('',onArc(a+delta*j/16),onArc(a+delta*(j+1)/16),'#9a6a2a'),arc:true});
   }
  });break;
 }
 case 'parallel-line-test':
  lines=[line('a',[-1.7,.85,0],[1.7,.85,0]),line('b',[-1.25,0,.3],[1.25,0,.3])];break;
 case 'parallel-line-property':{
  const alpha=plane('α'),beta=plane('β',[0,.45,0],[1.4,0,0],[0,1,0]);
  alpha.parts=[[[-1.4,0,-1],[1.4,0,-1],[1.4,0,0],[-1.4,0,0]],[[-1.4,0,0],[1.4,0,0],[1.4,0,1],[-1.4,0,1]]];
  beta.parts=[[[-1.4,-.55,0],[1.4,-.55,0],[1.4,0,0],[-1.4,0,0]],[[-1.4,0,0],[1.4,0,0],[1.4,1.45,0],[-1.4,1.45,0]]];
  planes=[alpha,beta];lines=[line('a',[-1.2,.9,0],[1.2,.9,0]),line('b',[-1.7,0,0],[1.7,0,0])];break;
 }
 case 'parallel-cuboid':{
  const v=[[-1,-.8,1],[1,-.8,1],[1,-.8,-1],[-1,-.8,-1],[-1,.8,1],[1,.8,1],[1,.8,-1],[-1,.8,-1]];
  planes=[plane('α',[0,0,-1],[1,0,0],[0,.8,0])];
  lines=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].map(([a,b])=>({...line('',v[a],v[b],'#a9b4b7'),guide:true}));
  lines.push(line('',v[0],v[1],colors.a),line('',v[3],v[2],colors.b));
  points=[point('A',v[0]),point('B',v[1]),point('C',v[2]),point('D',v[3]),point('C′',v[6]),point('D′',v[7])];break;
 }
 case 'parallel-plane-test':{
  const alpha=plane('α'),beta=mode?plane('β',[0,.45,-.3],[1.4,0,0],[0,1,0]):plane('β',[0,.85,0]);
  planes=[alpha,beta];
  if(mode){
   lines=[line('a',[-1.2,.45,-.3],[1.2,.45,-.3]),line('b',[-1.2,1,-.3],[1.2,1,-.3]),line('l',[-1.7,0,-.3],[1.7,0,-.3],colors.point)];
   // Split both plane patches at their actual intersection to retain depth cues.
   const cut=-.3;
   alpha.parts=[[[-1.4,0,-1],[1.4,0,-1],[1.4,0,cut],[-1.4,0,cut]],[[-1.4,0,cut],[1.4,0,cut],[1.4,0,1],[-1.4,0,1]]];
   beta.parts=[[[-1.4,-.55,cut],[1.4,-.55,cut],[1.4,0,cut],[-1.4,0,cut]],[[-1.4,0,cut],[1.4,0,cut],[1.4,1.45,cut],[-1.4,1.45,cut]]];
  }else{
   lines=[line('a',[-1.2,.85,0],[1.2,.85,0]),line('b',[-.45,.85,-.8],[.45,.85,.8])];points=[point('P',[0,.85,0])];
  }break;
 }
 case 'parallel-plane-section':{
  planes=[plane('α',[0,-.55,0]),plane('β',[0,.65,0]),{...plane('γ',[0,.05,0],[1.4,0,0],[0,1.05,0]),color:'#e4d6bd',stroke:'#916a2d'}];
  for(const f of planes.slice(0,2)){
   const y=f.o[1];f.parts=[[[-1.4,y,-1],[1.4,y,-1],[1.4,y,0],[-1.4,y,0]],[[-1.4,y,0],[1.4,y,0],[1.4,y,1],[-1.4,y,1]]];
  }
  planes[2].parts=[[-1,-.55],[-.55,.65],[.65,1.1]].map(([lo,hi])=>[[-1.4,lo,0],[1.4,lo,0],[1.4,hi,0],[-1.4,hi,0]]);
  lines=[line('a',[-1.6,-.55,0],[1.6,-.55,0]),line('b',[-1.6,.65,0],[1.6,.65,0])];break;
 }
 case 'parallel-segments':{
  planes=[plane('α',[0,-.6,0]),plane('β',[0,.6,0])];
  const A=[-.8,-.6,-.4],C=[.6,-.6,.4],B=add(A,[.3,1.2,.15]),D=add(C,[.3,1.2,.15]);
  lines=[line('',A,B,colors.point),line('',C,D,colors.point),line('',A,C,colors.a),line('',B,D,colors.b)];
  points=[point('A',A),point('B',B),point('C',C),point('D',D)];break;
 }
 case 'skew-angle':{
  planes=[];
  const o=[mode?.6:0,-.6,0],v=[.5,0,-Math.sqrt(3)/2],b=[0,.9,0];
  lines=[line('a',[-1.7,-.6,0],[1.7,-.6,0]),line('b',add(b,mul(v,-1.4)),add(b,mul(v,1.4)),colors.b),line('b′',add(o,mul(v,-1.4)),add(o,mul(v,1.4)),colors.b),{...line('',b,o,'#a9b4b7'),guide:true}];
  for(let j=0;j<20;j++){
   const p=t=>add(o,[.4*Math.cos(t),0,-.4*Math.sin(t)]);
   lines.push({...line(j===10?'θ':'',p(j*Math.PI/60),p((j+1)*Math.PI/60),'#9a6a2a'),arc:true});
  }
  points=[point('O',o)];break;
 }
 case 'normal-test':{
  if(mode){
   lines=[line('a',[-1.3,0,-.45],[1.3,0,-.45]),line('b',[-1.3,0,.45],[1.3,0,.45]),line('l',[0,0,-1.25],[0,0,1.25],colors.point)];
   for(const z of [-.45,.45])lines.push(...rightMark([0,0,z],[1,0,0],[0,0,1]));
  }else{
   lines=[line('a',[-1.3,0,0],[1.3,0,0]),line('b',[0,0,-1.2],[0,0,1.2]),line('l',[0,-.55,0],[0,1.45,0],colors.point)];
   lines.push(...rightMark([0,0,0],[1,0,0],[0,1,0]),...rightMark([0,0,0],[0,0,1],[0,1,0]));
  }break;
 }
 case 'plane-perpendicular-lines':{
  for(const [id,x] of [['l',-.7],['m',.7]]){
   lines.push(line(id,[x,-.35,0],[x,1.3,0],id==='l'?colors.a:colors.b),...rightMark([x,0,0],[1,0,0],[0,1,0]));
  }
  break;
 }
 case 'point-distance':{
  const P=[0,1.2,0],H=[0,0,0],Q=[1.2*(1-angle/100),0,0];
  lines=[line('',P,H,colors.a)];
  if(angle<100){
   lines.push(line('',H,Q,colors.b),line('',P,Q,'#9a6a2a'),...rightMark(H,[1,0,0],[0,1,0],Math.min(.16,Q[0]/2)));
   points=[point('P',P),point('H',H),point('Q',Q)];
  }else points=[point('P',P),{...point('H = Q',H),labelOffset:[-38,0]}];
  break;
 }
 case 'skew-cuboid':
 case 'normal-cuboid':
 case 'distance-cuboid':{
  const v=[[-1,-.8,1],[1,-.8,1],[1,-.8,-1],[-1,-.8,-1],[-1,.8,1],[1,.8,1],[1,.8,-1],[-1,.8,-1]];
  planes=kind==='skew-cuboid'?[]:[plane('α',[0,-.8,0],[1,0,0],[0,0,1])];
  lines=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].map(([a,b])=>({...line('',v[a],v[b],'#a9b4b7'),guide:true}));
  if(kind==='skew-cuboid'){
   lines.push(line('',v[0],v[1],colors.a),line('',v[2],v[6],colors.b),line('',v[1],v[5],colors.point),...rightMark(v[1],[-1,0,0],[0,1,0]));
   points=[point('A',v[0]),point('B',v[1]),point('C',v[2]),point('B′',v[5]),point('C′',v[6])];
  }else{
   lines.push(line('',v[0],v[4],colors.a),...rightMark(v[0],[1,0,0],[0,1,0]),...rightMark(v[0],[0,0,-1],[0,1,0]));
   points=['A','B','C','D','A′'].map((id,i)=>point(id,v[i]));
   if(kind==='normal-cuboid'){
    lines.push(line('',v[1],v[5],colors.b),...rightMark(v[1],[-1,0,0],[0,1,0]));points.push(point('B′',v[5]));
   }else{
    const Q=[.25,-.8,.15];lines.push(line('',v[4],Q,'#9a6a2a'),line('',v[0],Q,colors.b));points.push(point('Q',Q));
   }
  }break;
 }
 case 'line-plane-angle':{
  const t=angle*Math.PI/180,A=[-.8,0,0],v=[Math.cos(t),Math.sin(t),0],P=add(A,mul(v,2)),O=[P[0],0,0];
  planes=[plane('α',[0,0,0],[1.6,0,0],[0,0,1])];
  lines=[line('l',add(A,mul(v,-.3)),add(A,mul(v,2.25)),colors.a)];
  if(angle>0&&angle<90){
   lines.push(line('',A,O,colors.b),line('',P,O,'#9a6a2a'),...rightMark(O,[-1,0,0],[0,1,0],Math.min(.16,(O[0]-A[0])/3)),...angleMark(A,[1,0,0],[0,1,0],t));
   points=[point('A',A),point('O',O),point('P',P)];
  }else if(angle===0){points=[point('A',A),point('P、O',P)];}
  else{points=[point('A、O',A),point('P',P)];lines.push(...rightMark(A,[1,0,0],[0,1,0]));}
  break;
 }
 case 'projection-cube':{
  const v=[[-1,-1,1],[1,-1,1],[1,-1,-1],[-1,-1,-1],[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]],A=v[0],D=v[3],D1=v[7];
  planes=[plane('α',[0,-1,0],[1,0,0],[0,0,1])];
  lines=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].map(([a,b])=>({...line('',v[a],v[b],'#a9b4b7'),guide:true}));
  lines.push(line('',A,D1,colors.a),line('',A,D,colors.b),line('',D,D1,'#9a6a2a'),...rightMark(D,[0,0,1],[0,1,0]),...angleMark(A,[0,0,-1],[0,1,0],Math.PI/4));
  points=[point('A',A),point('D',D),point('D₁',D1)];break;
 }
 case 'dihedral-angle':{
  const t=angle*Math.PI/180,u=[0,0,1],v=[0,Math.sin(t),Math.cos(t)],O=[mode?.55:-.45,0,0],A=add(O,mul(u,1.1)),B=add(O,mul(v,1.1));
  planes=[plane('α',mul(u,.75),[1.4,0,0],mul(u,.75)),plane('β',mul(v,.75),[1.4,0,0],mul(v,.75))];
  lines=[line('l',[-1.8,0,0],[1.8,0,0],colors.l),line('',O,A,colors.a),line('',O,B,colors.b),...rightMark(O,[1,0,0],u),...rightMark(O,[-1,0,0],v)];
  if(angle>0)lines.push(...angleMark(O,u,[0,1,0],t));
  points=angle===0?[point('O',O),point('A、B',A)]:[point('O',O),point('A',A),point('B',B)];break;
 }
 case 'perpendicular-planes-test':
 case 'perpendicular-planes-property':{
  planes=[plane('α',[0,0,0],[1.4,0,0],[0,1.2,0]),plane('β',[0,0,0],[1.4,0,0],[0,0,1.2])];
  for(const f of planes){const m0=add(f.o,mul(f.u,-1)),m1=add(f.o,f.u);f.parts=[[f.p[0],f.p[1],m1,m0],[m0,m1,f.p[2],f.p[3]]];}
  const O=[-.3,0,0],property=kind==='perpendicular-planes-property',along=property&&mode===1;
  lines=[line(along?'a、c':'c',[-1.8,0,0],[1.8,0,0],along?colors.a:colors.l),line(property?'b':'m',add(O,[0,0,-.9]),add(O,[0,0,1.35]),colors.b)];
  if(!along)lines.push(line(property?'a':'l',add(O,[0,-.75,0]),add(O,[0,1.45,0]),colors.a),...rightMark(O,[1,0,0],[0,1,0]),...rightMark(O,[0,0,1],[0,1,0]));
  lines.push(...rightMark(O,[1,0,0],[0,0,1]));points=[point(property?'P':'O',O)];break;
 }
 default:throw new Error('Unknown space diagram: '+kind);
 }
 return {kind,planes,lines,points};
}
function angleMark(o,u,v,theta,r=.38){
 const p=t=>add(o,add(mul(u,r*Math.cos(t)),mul(v,r*Math.sin(t))));
 return Array.from({length:24},(_,i)=>({...line(i===12?'θ':'',p(theta*i/24),p(theta*(i+1)/24),'#9a6a2a'),arc:true}));
}
export function rightMark(o,u,v,size=.16){
 const a=add(o,mul(u,size)),b=add(a,mul(v,size)),c=add(o,mul(v,size));
 return [[a,b],[b,c]].map(([a,b])=>({...line('',a,b,'#9a6a2a'),arc:true}));
}
export function projectSpace([x,y,z],yaw=-.55,pitch=.5){
 const c=Math.cos(yaw),s=Math.sin(yaw),q=-x*s+z*c;
 return [x*c+z*s,y*Math.cos(pitch)-q*Math.sin(pitch),y*Math.sin(pitch)+q*Math.cos(pitch)];
}
const fmt=n=>n.toFixed(2),xy=p=>`${fmt(p[0])},${fmt(p[1])}`;
export function spaceSVG(kind,state={},yaw=-.55,pitch=.5){
 return renderSpaceScene(spaceScene(kind,state),yaw,pitch);
}
export function renderSpaceScene(scene,yaw=-.55,pitch=.5){
 const project=p=>projectSpace(p,yaw,pitch);
 const all=[...scene.planes.flatMap(f=>f.p),...scene.lines.flatMap(l=>[l.a,l.b]),...scene.points.map(p=>p.p)];
 const q=all.concat(scene.framingPoints||[]).map(project),xs=q.map(p=>p[0]),ys=q.map(p=>p[1]);
 const cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
 const scale=Math.min(91,385/(Math.max(...xs)-Math.min(...xs)||1),240/(Math.max(...ys)-Math.min(...ys)||1));
 const screen=p=>{const [x,y,z]=project(p);return [240+(x-cx)*scale,170-(y-cy)*scale,z];};
 const faces=scene.planes.flatMap(f=>(f.parts||[f.p]).map(p=>({...f,p}))).sort((a,b)=>project(center(a.p))[2]-project(center(b.p))[2]);
 const projected=faces.map(f=>f.p.map(project));
 function hidden(p){
  const [x,y,z]=project(p);
  return projected.some(poly=>{
   for(let i=1;i<poly.length-1;i++){
    const [a,b,c]=[poly[0],poly[i],poly[i+1]],d=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);
    if(Math.abs(d)<1e-10)continue;
    const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/d,v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/d,w=1-u-v;
    if(u>=0&&v>=0&&w>=0&&u*a[2]+v*b[2]+w*c[2]>z+.015)return true;
   }
   return false;
  });
 }
 let body=faces.map(f=>`<polygon points="${f.p.map(screen).map(xy).join(' ')}" fill="${f.color}" fill-opacity=".78"/>`).join('');
 const obstacles=[];
 for(const f of scene.planes){const ps=f.p.map(screen);ps.forEach((p,i)=>obstacles.push([p,ps[(i+1)%4]]));body+=`<polygon points="${ps.map(xy).join(' ')}" fill="none" stroke="${f.stroke||(f.id==='α'?colors.a:colors.b)}" stroke-width="1.3" stroke-opacity=".65"/>`;}
 for(const l of [...scene.lines].sort((a,b)=>Number(!!a.overlay)-Number(!!b.overlay)||project(center([a.a,a.b]))[2]-project(center([b.a,b.b]))[2])){
  const start=screen(l.a),tip=screen(l.b),length=Math.hypot(tip[0]-start[0],tip[1]-start[1]);
  const head=l.arrow?Math.min(9,length*.4):0,end=head?add(l.a,mul(sub(l.b,l.a),1-head/length)):l.b;
  const groups=[],steps=l.arc?1:48;
  for(let i=0;i<steps;i++){
   const a=add(l.a,mul(sub(end,l.a),i/steps)),b=add(l.a,mul(sub(end,l.a),(i+1)/steps)),back=hidden(center([a,b]));
   const last=groups.at(-1);if(last&&last.back===back)last.ps.push(b);else groups.push({back,ps:[a,b]});
  }
  for(const {ps,back} of groups)body+=`<polyline points="${ps.map(screen).map(xy).join(' ')}" fill="none" stroke="${l.color}" stroke-width="${l.guide?1.1:l.arc?1.6:2.8}"${back||l.guide?' stroke-dasharray="5 4"':''}/>`;
  if(l.arrow&&length>.5){
   const ux=(tip[0]-start[0])/length,uy=(tip[1]-start[1])/length,bx=tip[0]-ux*head,by=tip[1]-uy*head,w=head*.42;
   body+=`<polygon data-vector-head="true" points="${xy(tip)} ${xy([bx-uy*w,by+ux*w])} ${xy([bx+uy*w,by-ux*w])}" fill="${l.color}"/>`;
  }
  obstacles.push([screen(l.a),screen(l.b)]);
 }
 body+=scene.points.filter(p=>p.dot!==false).map(p=>{const s=screen(p.p);return `<circle cx="${fmt(s[0])}" cy="${fmt(s[1])}" r="4.3" fill="${p.color}" stroke="#fffdf7" stroke-width="1.5"/>`;}).join('');
 const labels=[...scene.points.map(p=>({...p,anchor:p.p})),...scene.lines.filter(l=>l.id).map(l=>({id:l.id,color:l.color,line:l,anchor:add(l.a,mul(sub(l.b,l.a),.91))})),...scene.planes.map(f=>({id:f.id,color:f.stroke||(f.id==='α'?colors.a:colors.b),anchor:f.label}))];
 const placed=[];
 function distance(p,a,b){const d=sub(b,a),t=Math.max(0,Math.min(1,((p[0]-a[0])*d[0]+(p[1]-a[1])*d[1])/(d[0]**2+d[1]**2||1)));return Math.hypot(p[0]-a[0]-t*d[0],p[1]-a[1]-t*d[1]);}
 for(const l of labels){
  const a=screen(l.anchor),candidates=l.labelOffset?[l.labelOffset]:[[-16,-18],[16,-18],[-18,20],[18,20],[0,-28],[0,28],[-32,0],[32,0]];
  const scored=candidates.map(([dx,dy])=>{const p=[Math.max(20,Math.min(460,a[0]+dx)),Math.max(22,Math.min(318,a[1]+dy))];let cost=0;for(const [b,c] of obstacles)cost+=Math.max(0,15-distance(p,b,c))**2;for(const b of placed)cost+=Math.max(0,30-Math.hypot(p[0]-b[0],p[1]-b[1]))**2;for(const v of scene.points){const b=screen(v.p);cost+=Math.max(0,18-Math.hypot(p[0]-b[0],p[1]-b[1]))**2;}if(l.line){const own=distance(p,screen(l.line.a),screen(l.line.b));for(const other of scene.lines){if(other===l.line||!other.id)continue;cost+=4*Math.max(0,own+10-distance(p,screen(other.a),screen(other.b)))**2;}}return {p,cost};});
  scored.sort((a,b)=>a.cost-b.cost);const p=scored[0].p;placed.push(p);
  body+=`<text x="${fmt(p[0])}" y="${fmt(p[1])}" fill="${l.color}" text-anchor="middle" dominant-baseline="middle" font-family="Georgia,serif" font-style="italic" font-size="21">${l.id}</text>`;
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 340" role="img" aria-label="空间关系示意，平面只画出一部分；可旋转观察">${body}</svg>`;
}
