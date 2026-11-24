// Shared mathematical model for printable SVG and interactive solid views.
export const names = {prism:'正四棱柱',pyramid:'正四棱锥',frustum:'正四棱台',cylinder:'圆柱',cone:'圆锥',taper:'圆台',ball:'球',combo:'圆柱与圆锥的组合体'};
export const sub=(a,b)=>a.map((v,i)=>v-b[i]);
export const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const unit=a=>a.map(v=>v/Math.hypot(...a));
export const center=a=>a[0].map((_,i)=>a.reduce((s,p)=>s+p[i],0)/a.length);
export function polyhedron(kind){
  const vertices=[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]];
  const faces=[[3,2,1,0]];
  if(kind==='pyramid'){
    vertices.push([0,1.5,0]);
    for(let i=0;i<4;i++)faces.push([i,(i+1)%4,4]);
  }else{
    const r=kind==='frustum'?.4:1, y=kind==='frustum'?.5:1;
    vertices.push(...vertices.map(([x,_,z])=>[r*x,y,r*z]));
    faces.push([4,5,6,7]);
    for(let i=0;i<4;i++)faces.push([i,(i+1)%4,(i+1)%4+4,i+4]);
  }
  return orient({vertices,faces,kind});
}
export function profile(kind){
  if(kind==='ball')return Array.from({length:49},(_,i)=>{const a=-Math.PI/2+i*Math.PI/48;return [i===0||i===48?0:1.15*Math.cos(a),1.15*Math.sin(a)];});
  if(kind==='cone')return [[0,-1],[1,-1],[0,1]];
  if(kind==='taper')return [[0,-1],[1,-1],[.45,1],[0,1]];
  if(kind==='combo')return [[0,-1.25],[1,-1.25],[1,.25],[0,1.25]];
  return [[0,-1],[1,-1],[1,1],[0,1]];
}
export function normal(vertices,face){
  for(let i=1;i<face.length-1;i++){
    const n=cross(sub(vertices[face[i]],vertices[face[0]]),sub(vertices[face[i+1]],vertices[face[0]]));
    if(Math.hypot(...n)>1e-9)return unit(n);
  }
  return [0,0,0];
}
function orient(model){
  const c=center(model.vertices);
  model.faces=model.faces.map(f=>dot(normal(model.vertices,f),sub(center(f.map(i=>model.vertices[i])),c))<0?f.toReversed():f);
  return model;
}
export function revolution(kind,segments=64){
  const p=profile(kind), vertices=[],faces=[];
  p.forEach(([r,y])=>{for(let j=0;j<segments;j++){const a=j*2*Math.PI/segments;vertices.push([r*Math.cos(a),y,r*Math.sin(a)]);}});
  for(let i=0;i<p.length-1;i++)for(let j=0;j<segments;j++){
    const k=(j+1)%segments;
    const f=p[i][0]===0?[i*segments+j,(i+1)*segments+j,(i+1)*segments+k]:p[i+1][0]===0?[i*segments+j,(i+1)*segments+j,i*segments+k]:[i*segments+j,(i+1)*segments+j,(i+1)*segments+k,i*segments+k];
    faces.push(f);
  }
  // All pole samples are one geometric vertex, not separate radial edges.
  const unique=[],ids=new Map(),remap=vertices.map(p=>{const key=p.map(v=>v.toFixed(8)).join(',');if(!ids.has(key)){ids.set(key,unique.length);unique.push(p);}return ids.get(key);});
  return orient({vertices:unique,faces:faces.map(f=>[...new Set(f.map(i=>remap[i]))]).filter(f=>f.length>=3),kind});
}
export const view=unit([5,3.6,7]);
const right=unit([7,0,-5]),up=cross(view,right);
export const project=(p,cx=240,cy=170,s=70)=>[cx+s*dot(p,right),cy-s*dot(p,up)];
export const oblique=([x,y,z],ox=80,oy=240,s=65)=>[ox+s*(x+y*Math.SQRT1_2/2),oy-s*(z+y*Math.SQRT1_2/2)];
const xy=p=>p.map(n=>Number(n.toFixed(3))).join(',');
const path=(ps,close=false)=>`M${ps.map(xy).join('L')}${close?'Z':''}`;
export function solidSVG(kind){
  if(kind==='ball'){
    const [cx,cy]=project([0,0,0]),r=1.15*70;
    return `<svg viewBox="0 0 480 340" role="img" aria-label="球面上的点到球心距离等于半径" xmlns="http://www.w3.org/2000/svg"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#dcece6" stroke="#215b69" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="3" fill="#215b69"/><path d="M${cx},${cy}h${r}" stroke="#176b87" stroke-width="1.5"/><text x="${cx-15}" y="${cy+24}">O</text><text x="${cx+r/2}" y="${cy-14}">R</text></svg>`;
  }
  const poly=['prism','pyramid','frustum'].includes(kind),m=poly?polyhedron(kind):revolution(kind,32);
  const projected=m.vertices.map(p=>project(p));
  const front=m.faces.map(f=>dot(normal(m.vertices,f),view)>1e-7);
  let shapes=m.faces.map((f,i)=>({f,i,z:dot(center(f.map(k=>m.vertices[k])),view)})).sort((a,b)=>a.z-b.z).filter(({i})=>front[i]).map(({f})=>{
    const n=normal(m.vertices,f),isBase=Math.abs(n[1])>.99;
    const light=.72+.28*Math.max(0,dot(n,unit([2,5,4])));
    const rgb=(isBase?[90,160,185]:kind==='combo'&&center(f.map(k=>m.vertices[k]))[1]>.25?[90,160,185]:[130,188,171]).map(v=>Math.round(v*light));
    return `<path d="${path(f.map(i=>projected[i]),true)}" fill="rgb(${rgb})" stroke="rgb(${rgb})" stroke-width="1.4" stroke-linejoin="round"/>`;
  }).join('');
  const edges=new Map();
  m.faces.forEach((f,fi)=>f.forEach((a,j)=>{const b=f[(j+1)%f.length];if(Math.hypot(...sub(m.vertices[a],m.vertices[b]))<1e-8)return;const key=[a,b].sort((x,y)=>x-y).join('-');if(!edges.has(key))edges.set(key,{a,b,fs:[]});edges.get(key).fs.push(fi);}));
  for(const {a,b,fs} of edges.values()){
    const visible=fs.some(i=>front[i]);
    const sharp=poly||fs.length===1||dot(normal(m.vertices,m.faces[fs[0]]),normal(m.vertices,m.faces[fs[1]]))<.9;
    const silhouette=fs.length===2&&front[fs[0]]!==front[fs[1]];
    if(!sharp&&!silhouette)continue;
    shapes+=`<path d="${path([projected[a],projected[b]])}" fill="none" stroke="${visible?'#215b69':'#536c76'}" stroke-width="${visible?1.7:1.15}"${visible?'':' stroke-dasharray="5 5"'}/>`;
  }
  if(kind==='frustum'){
    const apex=project([0,1.5,0]);
    for(let i=4;i<8;i++)shapes+=`<path d="${path([projected[i],apex])}" stroke="#a35f18" stroke-width="1.2" stroke-dasharray="5 4"/>`;
    shapes+=`<circle cx="${apex[0]}" cy="${apex[1]}" r="3" fill="#a35f18"/><text x="${apex[0]+15}" y="${apex[1]-10}">原顶点</text>`;
  }
  if(kind==='prism'){
    const label=(p,end,text)=>`<path d="${path([p,end])}" stroke="#637782" stroke-width="1"/><text x="${end[0]+8}" y="${end[1]+5}">${text}</text>`;
    shapes+=label(project([.1,1,0]),[365,64],'底面');
    shapes+=label(project([1,0,1]),[365,180],'侧棱');
    const v=project([1,-1,1]);shapes+=`<circle cx="${v[0]}" cy="${v[1]}" r="3.5" fill="#215b69"/>`+label(v,[365,286],'顶点');
  }
  return `<svg viewBox="0 0 480 340" role="img" aria-label="${names[kind]}的结构示意" xmlns="http://www.w3.org/2000/svg">${shapes}</svg>`;
}
export function profileSVG(kind){
  const p=profile(kind),to=([r,y])=>[100+r*90,166-y*90];
  const title={cylinder:'矩形',cone:'直角三角形',taper:'直角梯形',ball:'半圆区域',combo:'矩形与直角三角形'}[kind];
  let shapes=`<path d="${path(p.map(to),true)}" fill="#e0eff3" stroke="#176b87" stroke-width="2"/><path d="M100 24V306" stroke="#6f7885" stroke-width="1.2" stroke-dasharray="5 5"/><text x="80" y="35" text-anchor="end">轴</text>`;
  if(kind==='combo'){
    const axis=shapes.slice(shapes.indexOf('<path d="M100 24'));
    shapes=`<path d="${path([[0,-1.25],[1,-1.25],[1,.25],[0,.25]].map(to),true)}" fill="#d6e8df" stroke="#5a9c85" stroke-width="2"/><path d="${path([[0,.25],[1,.25],[0,1.25]].map(to),true)}" fill="#d8eaf0" stroke="#478ba9" stroke-width="2"/>`+axis+`<path d="${path([to([0,.25]),to([1,.25])])}" stroke="#a35f18" stroke-width="2" stroke-dasharray="5 4"/>`;
  }
  return `<svg viewBox="0 0 280 340" role="img" aria-label="${title}在旋转轴一侧" xmlns="http://www.w3.org/2000/svg">${shapes}</svg>`;
}
export function obliqueSVG(){
  const colors=['#176b87','#a35f18','#7651a8'];
  const v=[[0,0,0],[3,0,0],[3,2,0],[0,2,0],[0,0,1.5],[3,0,1.5],[3,2,1.5],[0,2,1.5]],p=v.map(q=>oblique(q));
  const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const hidden=new Set(['2,3','3,0','3,7']);
  let s=[[0,1,5,4],[1,2,6,5],[4,5,6,7]].map((f,i)=>`<path d="${path(f.map(k=>p[k]),true)}" fill="${['#e6f0ed','#d2e5df','#dceef3'][i]}"/>`).join('');
  s+=edges.map(e=>`<path d="${path(e.map(i=>p[i]))}" fill="none" stroke="${colors[v[e[0]].findIndex((value,i)=>value!==v[e[1]][i])]}" stroke-width="2"${hidden.has(e.join(','))?' stroke-dasharray="5 5"':''}/>`).join('');
  const origin=oblique([0,0,0]);
  for(const [i,[start,end,label,dx,dy]] of [[[-.85,0,0],[4.6,0,0],"x′",12,6],[[0,-1.6,0],[0,8.5,0],"y′",10,-8],[[0,0,-1.1],[0,0,3.1],"z′",-18,-6]].entries()){
    const a=oblique(end);s=`<path d="${path([oblique(start),a])}" stroke="${colors[i]}" stroke-width="1.7" fill="none" marker-end="url(#oblique-axis-${i})"/>`+s+`<text x="${a[0]+dx}" y="${a[1]+dy}" fill="${colors[i]}" font-style="italic" font-weight="600">${label}</text>`;
  }
  // Dimension labels occupy dedicated margins, never the object's faces or edges.
  const add=(p,q)=>p.map((v,i)=>v+q[i]),mid=(a,b)=>a.map((v,i)=>(v+b[i])/2);
  const measure=(a,b,offset,label,labelOffset,color,rotate=false)=>{
    const u=add(a,offset),v=add(b,offset),t=add(mid(u,v),labelOffset);
    return `<path d="${path([a,u])}${path([b,v])}${path([u,v])}" fill="none" stroke="${color}" stroke-opacity=".55"/><text x="${t[0]}" y="${t[1]}" fill="${color}" text-anchor="middle"${rotate?` transform="rotate(-90 ${t[0]} ${t[1]})"`:''}>${label}</text>`;
  };
  s+=`<text x="${origin[0]+10}" y="${origin[1]+22}">O′</text>`;
  s+=measure(p[0],p[1],[0,35],'3 cm',[0,24],colors[0]);
  s+=measure(p[1],p[2],[45,45],'1 cm',[30,18],colors[1]);
  s+=measure(p[0],p[4],[-25,0],'1.5 cm',[-12,0],colors[2],true);
  const markers=colors.map((color,i)=>`<marker id="oblique-axis-${i}" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L8,4L0,8Z" fill="${color}"/></marker>`).join('');
  return `<svg viewBox="0 0 470 330" role="img" aria-label="长方体斜二测图：蓝色x′轴为横向3厘米，橙色y′轴为纵深图长1厘米，紫色z′轴为高1.5厘米" xmlns="http://www.w3.org/2000/svg"><defs>${markers}</defs>${s}</svg>`;
}
