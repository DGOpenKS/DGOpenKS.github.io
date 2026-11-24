import {polyhedron,profile,normal,center,sub,unit} from './g-geometry.mjs?v=20261031-combo-labels';
export const isPolyhedron=k=>['prism','pyramid','frustum'].includes(k);
export function facePart(kind,index){
  const m=polyhedron(kind),points=m.faces[index].map(i=>m.vertices[i]),base=points.every(p=>p[1]===points[0][1]);
  return {id:base?'face':'side',label:base?'底面':'侧面',type:'polygon',points,normal:normal(m.vertices,m.faces[index]),color:base?0x478ba9:0x5a9c85,note:base?'这是一个完整的平面多边形区域，不是只有边框。':'这是一个完整的侧面；它与相邻侧面的公共边才是侧棱。'};
}
export function solidParts(kind){
  if(isPolyhedron(kind)){
    const m=polyhedron(kind),tip=kind==='pyramid'?4:6;
    return [{...facePart(kind,kind==='pyramid'?0:1),label:'面',note:'各面的形状、大小与朝向不变。'},
      {id:'edge',label:'棱',type:'line',points:[m.vertices[2],m.vertices[tip]],color:0xa35f18,note:'各棱的长度和方向不变。'},
      {id:'vertex',label:'顶点',type:'point',points:[m.vertices[kind==='pyramid'?4:2]],color:0x7155a3,note:'各顶点保留原来的相对方位。'}];
  }
  if(kind==='ball')return [
    {id:'surface',label:'球面',type:'sphere',radius:1.15,color:0x5a9c85,note:'移出的是球的表面；球还包含内部。球面不是平面多边形。'},
    {id:'center',label:'球心',type:'point',points:[[0,0,0]],color:0x7155a3,note:'球心在球的内部，不是顶点。淡色球面标出了球心原来的位置。'},
    {id:'radius',label:'半径',type:'line',points:[[0,0,0],[1.15,0,0]],color:0xa35f18,note:'半径连接球心与球面上的点；它不是棱。'}];
  if(kind==='combo')return [
    {id:'cylinder',label:'圆柱部分',type:'lathe',profile:[[0,-1.25],[1,-1.25],[1,.25],[0,.25]],color:0x5a9c85,note:'下部是圆柱。移开后能看到它与圆锥相接的圆形面。'},
    {id:'cone',label:'圆锥部分',type:'lathe',profile:[[0,.25],[1,.25],[0,1.25]],color:0x478ba9,note:'上部是圆锥。它的底面与圆柱的上底面重合。'},
    {id:'joint',label:'公共面',type:'disk',radius:1,y:.25,color:0xa35f18,note:'公共圆面位于组合体内部，不是组合体的外表面。'}];
  const top=kind==='cone'?0:kind==='taper'?.45:1;
  const result=[{id:'base',label:top?'下底面':'底面',type:'disk',radius:1,y:-1,color:0x478ba9,note:'移出的是整个圆形区域，圆周只是它的边界。'}];
  if(top)result.push({id:'top',label:'上底面',type:'disk',radius:top,y:1,color:0x478ba9,note:kind==='cylinder'?'圆柱的两个底面全等且平行。':'圆台的上、下底面平行，半径不同。'});
  result.push({id:'side',label:'侧面',type:'lathe',profile:[[1,-1],[top,1]],color:0x5a9c85,note:'移出的是完整的曲面，不包含底面；它不是多面体的平面侧面。'},
    {id:'generator',label:'母线',type:'line',points:[[1,-1,0],[top,1,0]],color:0xa35f18,note:'母线是生成侧面的线段，不是两个平面侧面的公共棱。'});
  if(kind==='cone')result.push({id:'tip',label:'顶点',type:'point',points:[[0,1,0]],color:0x7155a3,note:'所有母线的一端汇聚在这个顶点。'});
  return result;
}
export function wholeParts(kind){
  if(isPolyhedron(kind))return polyhedron(kind).faces.map((_,i)=>({...facePart(kind,i),faceIndex:i}));
  if(kind==='ball')return [solidParts(kind)[0]];
  if(kind==='combo')return [{type:'lathe',profile:[[0,-1.25],[1,-1.25],[1,.25]],color:0x5a9c85,id:'cylinder'},{type:'lathe',profile:[[1,.25],[0,1.25]],color:0x478ba9,id:'cone'}];
  return solidParts(kind).filter(p=>['disk','lathe'].includes(p.type));
}
export function sweepProfile(kind){return profile(kind);}

export function explodedParts(kind,category){
  const m=polyhedron(kind),origin=center(m.vertices);
  if(category==='face')return m.faces.map((_,i)=>{const p=facePart(kind,i);return {...p,id:'face',faceIndex:i,offset:p.normal.map(v=>v*.85)};});
  const edges=new Map();for(const f of m.faces)for(let i=0;i<f.length;i++){const pair=[f[i],f[(i+1)%f.length]].sort((a,b)=>a-b);edges.set(pair.join(','),pair.map(i=>m.vertices[i]));}
  const points=category==='edge'?[...edges.values()]:m.vertices.map(p=>[p]);
  return points.map(p=>({id:category,label:category==='edge'?'棱':'顶点',type:category==='edge'?'line':'point',points:p,radius:.065,color:category==='edge'?0xa35f18:0x7155a3,offset:unit(sub(center(p),origin)).map(v=>v*.85)}));
}
