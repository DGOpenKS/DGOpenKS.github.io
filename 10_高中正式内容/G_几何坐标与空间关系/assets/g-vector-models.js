import {renderSpaceScene,rightMark} from './g-space-models.js?v=20261124-distance-foot';
import {cross,sub,unit} from './g-geometry.js?v=20261031-combo-labels';
const blue='#176b87',green='#28785e',purple='#79539e',amber='#9a6a2a',gray='#a9b4b7';
const add=(a,b)=>a.map((v,i)=>v+b[i]),mul=(a,t)=>a.map(v=>v*t);
const line=(a,b,color=gray,id='',extra={})=>({a,b,color,id,...extra});
const arrow=(a,b,color)=>line(a,b,color,'',{arrow:true});
const point=(id,p,color=purple,dot=false)=>({id,p,color,dot});
function plane(id,o,u,v){return {id,o,u,v,n:cross(u,v),p:[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>add(o,add(mul(u,a),mul(v,b)))),color:'#bdd5df',label:add(o,add(mul(u,-.8),mul(v,.75)))};}
export const coordinateWorld=([x,y,z])=>[x,z,-y];
export function lineCoordinateExample(t){
 const start=[1,1,1],displacement=mul([2,-1,1],t);
 return {start,displacement,end:add(start,displacement)};
}
export function vectorScene(kind,{mode=0,angle=50,s=1,t=1,showOrigin=false}={}){
 let planes=[],lines=[],points=[];const O=[0,0,0];
 if(kind==='vector-coplanar'||kind==='vector-cube-sum'){
  const A=O,B=[1.8,0,0],D=[0,0,1.4],C=add(B,D),Ap=[0,1.4,0],Cp=add(C,Ap),M=add(C,mul(Ap,.5)),v=[A,B,C,D,Ap,add(B,Ap),Cp,add(D,Ap)];
  planes=[plane('α',[.9,0,.7],[.9,0,0],[0,0,.7])];
  lines=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].map(([a,b])=>line(v[a],v[b],gray,'',{guide:true}));
  if(kind==='vector-coplanar'){
   lines.push(arrow(A,B,blue),arrow(A,D,green),arrow(A,mode?Ap:C,purple));points=[point('A',A,purple,true),point('B',B),point('D',D),point(mode?'A′':'C',mode?Ap:C)];
  }else{
   const P=mode?M:Cp;
   // The third arrow and the unused half together draw CC′; omit its dashed duplicate.
   lines=lines.filter(edge=>edge.a!==C||edge.b!==Cp);
   if(mode)lines.push(line(M,Cp,'#79858c'));
   lines.push(arrow(A,B,blue),arrow(B,C,green),arrow(C,P,purple),arrow(A,P,amber));
   points=[point('A',A,blue,true),point('B',B,blue),point('C',C,green),
    point('C′',Cp,mode?'#606d75':purple,!!mode),point('M',M,purple,true),
    point('D',D,'#606d75'),point('A′',Ap,'#606d75')];
  }
 }else if(kind==='vector-projection'){
  const t=angle*Math.PI/180,alongLine=angle===0||angle===180;
  const A=[angle===90?0:1.4*Math.cos(t),alongLine?0:1.4*Math.sin(t),0],B=[1.8,0,0],H=[A[0],0,0];
  const left=[-1.7,0,0],right=[2,0,0];
  lines=[arrow(O,B,green),{...arrow(O,A,blue),overlay:alongLine},
   line(left,H[0]<0?H:O,gray)];
  points=[point(angle===90?'O = H':'O',O,purple,true),point('B',B,green),point(alongLine?'A = H':'A',A,blue)];
  if(angle===90){
   points[0].labelOffset=[-30,20];
   lines.push(...rightMark(O,[1,0,0],[0,1,0]));
  }else if(!alongLine){
   lines.push(line(H,A,gray,'',{guide:true}),{...arrow(O,H,amber),overlay:true});
   points.push(point('H',H,amber));
   const size=Math.min(.14,Math.abs(H[0])/2,A[1]/2);
   if(size>.04)lines.push(...rightMark(H,[-Math.sign(H[0]),0,0],[0,1,0],size));
  }
  if(angle>0&&angle!==90){
   const onArc=(fraction,radius)=>[radius*Math.cos(t*fraction),radius*Math.sin(t*fraction),0];
   for(let i=0;i<24;i++)lines.push(line(onArc(i/24,.3),onArc((i+1)/24,.3),amber,'',{arc:true}));
   if(angle>=25)points.push({...point('θ',onArc(.5,.58),amber),labelOffset:[0,0]});
  }
  return {kind,planes,lines,points,framingPoints:[left,right,add(left,[0,1.4,0]),add(right,[0,1.4,0])]};
 }else if(kind==='vector-basis'){
  const a=[1.3,0,.15],b=[.45,0,1],c=[.25,1.2,-.1],Q=add(mul(a,1.2),mul(b,.75)),P=add(Q,c);
  planes=[plane('α',add(mul(a,.65),mul(b,.45)),mul(a,.9),mul(b,.85))];
  lines=[arrow(O,a,blue),arrow(O,b,green),arrow(O,c,purple),arrow(O,Q,amber),arrow(Q,P,purple),arrow(O,P,blue)];
  points=[point('O',O,purple,true),point('A',a,blue),point('B',b,green),point('C',c,purple),point('Q',Q,amber),point('P',P,blue)];
 }else if(kind==='vector-axes'||kind==='vector-coordinates'){
  const dirs=[[1,0,0],[0,1,0],[0,0,1]],colors=[blue,green,purple];
  dirs.forEach((v,i)=>{
   lines.push(line(coordinateWorld(mul(v,-1.6)),coordinateWorld(mul(v,3.5)),colors[i],'xyz'[i],{arrow:true}));
   const side=dirs[(i+1)%3];
   for(const n of [-1,1,2,3]){const q=mul(v,n);lines.push(line(coordinateWorld(add(q,mul(side,-.055))),coordinateWorld(add(q,mul(side,.055))),colors[i],'',{arc:true}));}
   points.push(point('1',coordinateWorld(v),colors[i]));
  });
  points.push(point('O',O,purple,true));
  if(kind==='vector-coordinates'){
   const P=coordinateWorld(mode===2?[2,0,0]:mode===1?[2,-1,0]:[2,-1,3]),U=coordinateWorld([2,0,0]),V=coordinateWorld([2,-1,0]);
   if(mode!==2){lines.push(line(O,U,blue,'',{guide:true}),line(U,V,green,'',{guide:true}));if(mode===0)lines.push(line(V,P,purple,'',{guide:true}));}
   lines.push(arrow(O,P,amber));points.push(point('P',P,amber));
   if(mode===1)planes=[plane('Oxy',coordinateWorld([1,-.3,0]),[2,0,0],[0,0,1.5])];
  }
 }else if(kind==='vector-zero-coordinates'){
  const axes=[[1,0,0],[0,1,0],[0,0,1]].map(coordinateWorld);
  const active=[[0,1],[1,2],[0,2],[0],[1],[2]][mode];
  const colors=[blue,green,purple];
  for(const [i,axis] of axes.entries()){
   const color=active.includes(i)?colors[i]:'#87969b';
   lines.push(line(mul(axis,-2.3),mul(axis,2.9),color,'xyz'[i],{arrow:true}));
  }
  const u=axes[active[0]],v=axes[active[1]];
  let P=mul(u,1.5);
  if(v){
   planes=[plane(['Oxy','Oyz','Oxz'][mode],O,mul(u,2),mul(v,2))];
   P=add(P,mul(v,1));
   lines.push(line(mul(u,1.5),P,gray,'',{guide:true}),line(mul(v,1),P,gray,'',{guide:true}));
  }
  points=[point('O',O,blue,true),point('P',P,amber,true)];
 }else if(kind==='vector-displacement'){
  const A=coordinateWorld([1,-2,3]), B=coordinateWorld([4,2,-1]);
  const [start,end]=mode?[B,A]:[A,B];
  const x=[end[0],start[1],start[2]],xy=[end[0],start[1],end[2]];
  lines=[arrow(start,x,blue),arrow(x,xy,green),arrow(xy,end,purple),arrow(start,end,amber)];
  points=[point('A',A),point('B',B)];
 }else if(kind==='vector-parametric-line'){
  const A=[-.65,1.65,0],v=[1.6,.7,0],t=[1,0,-1][mode];
  const P=add(A,mul(v,t));
  lines=[line(add(A,mul(v,-1.6)),add(A,mul(v,1.75)),'#73838b','l',{arrow:true}),
   arrow(O,A,blue)];
  points=[point('O',O,blue,true),point(t===0?'A = P':'A',A,blue,true)];
  if(t!==0){
   lines.push({...arrow(A,P,green),overlay:true},arrow(O,P,amber));
   points.push(point('P',P,amber,true));
  }
 }else if(kind==='vector-line-coordinates'){
  const {start,end}=lineCoordinateExample(t);
  const alongX=[end[0],start[1],start[2]],alongXY=[end[0],end[1],start[2]];
  const colors=[blue,green,purple];
  for(const [i,extent] of [3.7,2.7,2.8].entries()){
   const axis=[0,0,0];axis[i]=1;
   lines.push(line(coordinateWorld(mul(axis,-1.4)),coordinateWorld(mul(axis,extent)),colors[i],'xyz'[i],{arrow:true,arc:true}));
  }
  const onLine=k=>coordinateWorld(lineCoordinateExample(k).end);
  lines.push(line(onLine(-1.3),onLine(1.35),'#7b878b','l',{arc:true}));
  points=[point('O',O,'#647177',true),point(t===0?'A = P':'A',coordinateWorld(start),amber,true)];
  if(t!==0){
   const path=[start,alongX,alongXY,end].map(coordinateWorld);
   for(let i=0;i<3;i++)lines.push(arrow(path[i],path[i+1],colors[i]));
   lines.push({...arrow(path[0],path[3],amber),overlay:true});
   points.push(point('P',path[3],amber,true));
  }
  // The component path can extend beyond the projected line. Hold the view
  // fixed as t changes by including its extreme corners in every frame.
  const framingPoints=[];
  for(const k of [-1,1]){
   const {end}=lineCoordinateExample(k);
   framingPoints.push(coordinateWorld([end[0],start[1],start[2]]),coordinateWorld([end[0],end[1],start[2]]));
  }
  return {kind,planes,lines,points,framingPoints};
 }else if(kind==='vector-plane-walk'){
  const A=[-.8,0,-.35],u=[1.25,0,0],v=[.25,0,1];
  const B=add(A,mul(u,s)),P=add(B,mul(v,t));
  const origin=[-1.25,1.35,-.25];
  planes=[plane('α',O,[1.65,0,0],[0,0,1.65])];
  lines=[arrow(A,B,blue),arrow(B,P,green),arrow(A,P,amber)];
  points=[point('A',A,blue,true),point('B',B,green,true),point('P',P,amber,true)];
  if(showOrigin){
   lines.push(arrow(origin,A,purple),arrow(origin,P,'#657278'));
   points.push(point('O',origin,purple,true));
  }
  // Reserve the reference point's space even while its arrows are hidden.
  return {kind,planes,lines,points,framingPoints:[origin]};
 }else if(kind==='vector-normal-component'){
  const A=[-.95,0,.4],H=[.75,0,-.25],P=add(H,[0,mode?1.1:0,0]);
  planes=[plane('α',O,[1.55,0,0],[0,0,1.15])];
  lines=[arrow(A,add(A,[0,1.4,0]),purple),arrow(A,P,blue)];
  if(mode)lines.push(line(H,P,amber,'',{guide:true}),line(A,H,gray,'',{guide:true}));
  points=[point('A',A,blue,true),point('P',P,blue,true)];
 }else if(kind==='vector-two-lines'){
  const x=[1,0,0],v=mode<2?x:[.25,0,1],B=[0,mode===0||mode===3?.85:0,0];
  const A=mul(x,-.65);
  lines=[line(mul(x,-1.6),mul(x,1.6),blue,mode===1?'l = m':'l')];
  if(mode!==1)lines.push(line(add(B,mul(v,-1.6)),add(B,mul(v,1.6)),green,'m'));
  lines.push({...arrow(mul(x,.85),mul(x,1.6),blue),overlay:true},
   {...arrow(add(B,mul(v,-.85)),add(B,mul(v,-1.6)),green),overlay:true},
   {...arrow(A,B,amber),overlay:true});
  points=[point('A',A,blue,true),point('B',B,green,true)];
 }else if(kind==='vector-plane-normals'||kind==='vector-angle-planes'){
  if(kind==='vector-angle-planes')mode=3;
  const a=plane('α',O,[1.4,0,0],[0,0,1]);
  const tilted=mode>=2,B=tilted?O:[0,mode===0?1:0,0];
  const v=mode===3?[0,.8660254,.5]:tilted?[0,1,0]:[0,0,1];
  const b=plane('β',B,[1.4,0,0],v);
  b.color='#c8dfcf';
  planes=mode===1?[{...a,id:'α = β'}]:[a,b];
  if(tilted){
   for(const f of planes)f.parts=[-1,1].map(k=>[mul(f.u,-1),f.u,add(f.u,mul(f.v,k)),add(mul(f.u,-1),mul(f.v,k))]);
   lines.push(line([-1.6,0,0],[1.6,0,0],gray,'l'));
  }
  const A=tilted?O:[-.8,0,.35],C=tilted?O:add(B,[.8,0,-.35]);
  lines.push(arrow(A,add(A,[0,1.25,0]),blue),arrow(C,add(C,[0,1.25*v[2],-1.25*v[1]]),green));
  points=tilted?[point('O',O,purple,true)]:[point('A',A,blue,true),point('B',C,green,true)];
 }else if(kind==='vector-foot-line'||kind==='vector-foot-plane'){
  const onLine=kind==='vector-foot-line',base=[-1,0,0],H=[.65,0,onLine?0:.55];
  const P=add(H,[0,1.35,onLine?.6:0]);
  if(onLine)lines.push(line([-1.55,0,0],[1.65,0,0],green,'l',{arrow:true}));
  else planes=[plane('α',O,[1.55,0,0],[0,0,1.1])];
  lines.push(arrow(base,P,blue),line(base,H,green),line(H,P,amber));
  if(!onLine)lines.push(arrow(base,add(base,[0,1,0]),purple));
  points=[point(onLine?'A':'Q',base,blue,true),point('H',H,amber,true),point('P',P,blue,true)];
  if(onLine){
   const T=[1.45,0,0];
   points.push(point('T',T,green,true));
   lines.push(line(P,T,gray,'',{guide:true}),...rightMark(H,unit(sub(T,H)),unit(sub(P,H)),.2));
  }
 }else if(kind==='vector-parallel-distance'){
  const base=plane('α',O,[1.55,0,0],[0,0,1]);
  if(mode===1)lines.push(line([-1.55,0,0],[1.55,0,0],green,'m'));
  else planes.push(base);
  if(mode===2)planes.push({...plane('β',[0,.95,0],base.u,base.v),color:'#c8dfcf'});
  else lines.push(line([-1.55,.95,0],[1.55,.95,0],blue,'l'));
  for(const [x,top,foot] of [[-.8,'P','H'],[.8,'Q','K']]){
   const H=[x,0,0],P=[x,.95,0];
   lines.push(line(H,P,amber));
   points.push(point(top,P,blue,true),point(foot,H,green,true));
  }
 }else if(kind==='vector-collinear-example'){
  const A=[1.1,0,0],B=mul(A,mode?-1.6:1.6),offset=[0,.6,0];
  lines=[arrow(O,A,blue),arrow(offset,add(offset,B),green)];
  points=[point('O',O,blue,true),point('A',A,blue),point('P',offset,green,true),point('B',add(offset,B),green)];
 }else if(kind==='vector-coplanar-sum'){
  const A=[1.3,0,0],B=[.15,0,1.2],C=add(A,B);
  planes=[plane('α',mul(C,.5),mul(A,.8),mul(B,.85))];
  lines=[arrow(O,A,blue),arrow(O,B,green),arrow(O,C,amber),line(A,C,green,'',{guide:true}),line(B,C,blue,'',{guide:true})];
  points=[point('O',O,blue,true),point('A',A,blue),point('B',B,green),point('C',C,amber)];
 }else if(kind==='vector-angle-normal'){
  const H=coordinateWorld([Math.sqrt(3),0,0]),P=coordinateWorld([Math.sqrt(3),0,1]),N=coordinateWorld([0,0,1]);
  planes=[plane('α',[.65,0,0],[1.5,0,0],[0,0,1.45])];
  lines=[arrow(O,P,blue),arrow(O,N,purple),arrow(O,H,green),line(H,P,gray,'',{guide:true})];
  points=[point('O',O,blue,true),point('P',P,blue),point('H',H,green),point('N',N,purple)];
  const onArc=(angle,radius)=>[radius*Math.cos(angle),radius*Math.sin(angle),0];
  const slope=Math.PI/6;
  for(const [start,end,radius,labelRadius,label,color] of [
   [0,slope,.60,.99,'30°',green],
   [slope,Math.PI/2,.46,.76,'60°',purple]
  ]){
   for(let i=0;i<20;i++){
    const from=start+(end-start)*i/20,to=start+(end-start)*(i+1)/20;
    lines.push(line(onArc(from,radius),onArc(to,radius),color,'',{arc:true}));
   }
   points.push({...point(label,onArc((start+end)/2,labelRadius),color),labelOffset:[0,0]});
  }
 }else if(kind==='vector-two-directions'){
  const U=[1.25,0,0],V=mul([.65,1,0],mode?-1:1);
  lines=[line(mul(U,-1.4),mul(U,1.4),gray,'l'),line([-.9,-1.38,0],[.9,1.38,0],gray,'m'),
   {...arrow(O,U,blue),overlay:true},{...arrow(O,V,green),overlay:true}];
  points=[point('O',O,purple,true)];
 }else if(kind==='vector-dot-coordinate'){
  const to=coordinateWorld,A=to([2,0,0]),B=to([3,4,1]),H=to([3,0,0]);
  const up=unit(sub(B,H)),offset=mul(up,-.48),end=add(H,offset);
  lines=[line(O,to([3.6,0,0]),gray,'x',{arrow:true}),arrow(O,B,green),{...arrow(O,A,blue),overlay:true},
   line(H,B,amber,'',{guide:true}),...rightMark(H,[-1,0,0],up,.18),
   line(offset,end,amber,'',{arc:true})];
  for(const p of [offset,end])lines.push(line(add(p,mul(up,-.08)),add(p,mul(up,.08)),amber,'',{arc:true}));
  points=[point('O',O,blue,true),point('A',A,blue),point('B',B,green),point('H',H,amber,true)];
  points.push({...point('OA = 2',add(mul(A,.5),mul(up,.23)),blue),labelOffset:[0,0]},
   {...point('OH = 3',add(mul(H,.5),mul(up,-.78)),amber),labelOffset:[0,0]});
 }else if(kind==='vector-plane-normal'){
  const u=coordinateWorld([1,0,1]),v=coordinateWorld([0,1,1]),n=coordinateWorld([-1,-1,1]);
  planes=[plane('α',O,mul(u,1.28),mul(v,1.28))];
  lines=[arrow(O,u,blue),arrow(O,v,green),arrow(O,n,purple)];
  points=[point('A',O,purple,true),point('U',u,blue),point('V',v,green),point('N',n,purple)];
 }else if(kind==='vector-line-incidence'){
  const A=[0,mode?0:1,0],B=[-1,0,.6],normalEnd=add(B,[0,1.25,0]);
  planes=[plane('α',O,[1.5,0,0],[0,0,1])];
  lines=[line(add(A,[-1.6,0,0]),add(A,[1.6,0,0]),blue,'l'),
   arrow(B,normalEnd,purple)];
  points=[point('A',A,blue,true),point('B',B,purple,true)];
 }else if(kind==='vector-three-perpendiculars'||kind==='vector-perpendicular-conditions'){
  const conditions=kind==='vector-perpendicular-conditions';
  const B=O,A=[0,1.35,0],C=[1.45,0,0];
  planes=[plane('α',[.65,0,0],[1.18,0,0],[0,0,1.35])];
  if(conditions&&mode===3){
   lines=[line(A,B,blue)];
   points=[point('A',A,blue,true),{...point('B = C',B,green,true),labelOffset:[34,8]}];
  }else{
   lines=[line(A,B,purple),line(B,C,green),line(A,C,blue)];
   points=[point('A',A,blue,true),point('B',B,purple,true),point('C',C,green,true)];
   if(conditions&&mode===2){
    const D=[-.28,0,1.02];
    lines.push(line(A,D,amber,'',{guide:true}),line(D,C,amber,'',{guide:true}),
     ...rightMark(B,[0,1,0],[1,0,0],.2));
    points.push(point('D',D,amber,true));
   }else{
    const tilted=conditions?mode===0:mode!==0;
    const d=[0,tilted ? .8 : 0,conditions ? -1 : 1];
    const ray=unit(d),offset=conditions?mul(ray,1.26):d,tip=add(C,offset);
    lines.push(line(sub(C,offset),tip,amber,'l',{arrow:conditions}),
     ...rightMark(C,unit(sub(B,C)),ray,.2));
    if(conditions){
     const ca=unit(sub(A,C));
     if(tilted){
      const foot=[tip[0],0,tip[2]];
      lines.push(line(C,foot,gray,'',{guide:true}),line(foot,tip,purple,'',{guide:true}));
      // Normalized combinations trace the shorter circular arc between CA and l.
      let last=add(C,mul(ca,.46));
      for(let i=1;i<=16;i++){
       const t=i/16,next=add(C,mul(unit(add(mul(ca,1-t),mul(ray,t))),.46));
       lines.push(line(last,next,blue,'',{arc:true}));
       last=next;
      }
     }else{
      lines.push(...rightMark(C,ca,mul(ray,-1),.29).map(edge=>({...edge,color:blue})));
     }
    }
   }
  }
  if(conditions){
   const framingPoints=[unit([0,.8,-1]),[0,0,-1]].flatMap(v=>[-1.26,1.26].map(k=>add(C,mul(v,k))));
   return {kind,planes,lines,points,framingPoints:[A,...framingPoints]};
  }
 }else if(kind==='vector-target-distance'){
  const P=coordinateWorld([1,2,3]),Q=coordinateWorld([0,0,1]),H=coordinateWorld(mode?[1,0,1]:[1,2,1]);
  if(mode)lines=[line(coordinateWorld([-1,0,1]),coordinateWorld([2.5,0,1]),green,'l')];
  else planes=[plane('α',coordinateWorld([.55,.9,1]),[1.55,0,0],[0,0,1.8])];
  lines.push(arrow(Q,P,blue),line(Q,H,green,'',{guide:true}),line(H,P,amber));
  points=[point('P',P,blue),point('Q',Q,green,true),point('H',H,amber,true)];
 }else if(kind==='vector-chosen-dihedral'){
  const axis=[1.3,0,0],u=[0,0,1],angle=(mode?-120:60)*Math.PI/180;
  const ray=t=>[0,Math.sin(t),Math.cos(t)],v=ray(angle);
  planes=[plane('α',mul(u,.82),axis,mul(u,.82)),
   {...plane('β',mul(v,.82),axis,mul(v,.82)),color:'#c5ddce'}];
  lines=[line(mul(axis,-1.12),mul(axis,1.12),purple,'l'),arrow(O,u,blue),arrow(O,v,green)];
  for(let i=0;i<24;i++)lines.push(line(mul(ray(angle*i/24),.4),mul(ray(angle*(i+1)/24),.4),amber,'',{arc:true}));
  points=[point('O',O,purple,true),point('U',u,blue),point('V',v,green)];
 }else throw new Error('Unknown vector diagram: '+kind);
 return {kind,planes,lines,points};
}
export function vectorSVG(kind,state={},yaw=-.55,pitch=.5){return renderSpaceScene(vectorScene(kind,state),yaw,pitch).replace('空间关系示意，平面只画出一部分；可旋转观察','空间向量与坐标示意；可旋转观察');}
