// Sphere surface bands and inscribed-polyhedron decompositions share R = 1.
const blue='#80b3c3',green='#8bb7a2',amber='#dfaa68';
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,s)=>a.map(v=>v*s),dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>mul(a,1/Math.hypot(...a));
const center=p=>mul(p.reduce((a,b)=>add(a,b),[0,0,0]),1/p.length);
const label=(p,text,color='#244855',offset=[0,0])=>({p,text,color,offset});
export function sphereTriangles(level=1){
 const t=(1+Math.sqrt(5))/2;
 const v=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(unit);
 let faces=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]].map(f=>f.map(i=>v[i]));
 for(let n=0;n<level;n++)faces=faces.flatMap(([a,b,c])=>{const ab=unit(add(a,b)),bc=unit(add(b,c)),ca=unit(add(c,a));return [[a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca]];});
 return faces.map(p=>dot(cross(sub(p[1],p[0]),sub(p[2],p[0])),p[0])<0?[p[0],p[2],p[1]]:p);
}
const triangles=sphereTriangles();
// Choose a front-facing representative; its detail view uses exactly these vertices.
export const selectedTriangle=triangles.reduce((best,p,i)=>dot(unit(center(p)),[1,.25,.2])>dot(unit(center(triangles[best])),[1,.25,.2])?i:best,0);
// Orient closed tetrahedra outwards before back-face removal.
function pyramidFaces(p,shift,color,id){
 const tip=shift,base=p.map(v=>add(v,shift)),cent=add(mul(center(p),.75),shift);
 return [base,...base.map((v,i)=>[tip,v,base[(i+1)%3]])].map((q,i)=>{
  const n=cross(sub(q[1],q[0]),sub(q[2],q[0]));
  return {p:dot(n,sub(q[0],cent))<0?q.slice().reverse():q,color:i===0?color:blue,edge:true,cull:true,group:id,sortCenter:cent};
 });
}
export function sphereBands(value){
 const faces=[],lines=[],labels=[],count=8,n=48,m=3;
 for(let object=0;object<2;object++){
  const cx=object?1.5:-1.5;
  for(let band=0;band<count;band++){
   const lo=-1+2*band/count,hi=lo+2/count,dy=(lo+hi)/2*.85*value,color=band===5?amber:band%2?green:blue;
   const point=(y,a)=>{const r=object?1:Math.sqrt(Math.max(0,1-y*y));return [cx+r*Math.cos(a),y+dy,r*Math.sin(a)];};
   // Sample latitude rather than height near the poles to avoid a coarse cap.
   const a0=Math.asin(lo),a1=Math.asin(hi);
   for(let j=0;j<m;j++)for(let i=0;i<n;i++){
    const y0=object?lo+(hi-lo)*j/m:Math.sin(a0+(a1-a0)*j/m),y1=object?lo+(hi-lo)*(j+1)/m:Math.sin(a0+(a1-a0)*(j+1)/m);
    const a=2*Math.PI*i/n,b=2*Math.PI*(i+1)/n;
    const p=!object&&y1>1-1e-9?[point(y0,a),point(y1,a),point(y0,b)]:[point(y0,a),point(y1,a),point(y1,b),point(y0,b)];
    faces.push({p,color,edge:false});
   }
  }
  labels.push(label([cx,1+.75*value,0],object?'圆柱侧面':'球面','#244855',[0,-36]));
 }
 return {faces,lines,labels,aria:'相同高度的球面带与圆柱带逐条对应；分离只改变展示间距'};
}
export function spherePyramids(value){
 const faces=triangles.flatMap((p,i)=>{
  const normal=unit(cross(sub(p[1],p[0]),sub(p[2],p[0])));
  const shift=mul(normal,value*(i===selectedTriangle?1.2:.43));
  return pyramidFaces(p,shift,i===selectedTriangle?amber:(i%2?green:blue),i);
 });
 return {faces,lines:[],labels:[],aria:'内接多面体由共用球心顶点的八十个小棱锥组成；橙色为选中的一个'};
}
export function spherePiece(){
 const p=triangles[selectedTriangle],n=unit(cross(sub(p[1],p[0]),sub(p[2],p[0]))),u=unit(sub(p[1],p[0])),v=cross(n,u);
 const base=p.map(q=>[dot(q,u),dot(q,n),dot(q,v)]),h=dot(p[0],n);
 const faces=pyramidFaces(base,[0,0,0],amber,0);
 return {faces,lines:[{p:[[0,0,0],[0,h,0]],color:'#7651a8',dash:true},{p:[[0,h,0],[.7,h,0]],color:'#8a5119',dash:true},{p:[[0,h/2,0],[-.48,h/2,0]],color:'#7651a8',dash:true}],labels:[label([0,0,0],'O','#244855',[-17,14]),label([-.48,h/2,0],'h','#7651a8',[-12,0]),label([.7,h,0],'ΔS','#8a5119',[18,0])],aria:'单个小棱锥，底面为三角形，顶点O是原球心，垂直高h小于球半径R'};
}
export function sphereModel(kind,value){
 if(kind==='sphere-bands')return sphereBands(value);
 if(kind==='sphere-pyramids')return spherePyramids(value);
 if(kind==='sphere-piece')return spherePiece();
 return null;
}
