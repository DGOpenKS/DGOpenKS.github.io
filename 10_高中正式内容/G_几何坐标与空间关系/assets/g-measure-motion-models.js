const side='#80b3c3',base='#8bb7a2',cut='#dfaa68',purple='#aa98be';
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const face=(p,color=side,edge=false)=>({p,color,edge});
const label=(p,text,color='#244855',offset=[0,0])=>({p,text,color,offset});
const line=(p,color='#a35f18',dash=false)=>({p,color,dash});
const sample=(f,n=96)=>Array.from({length:n+1},(_,i)=>f(-Math.PI+2*Math.PI*i/n));

// A cone opens by increasing sin(half-angle); compressing azimuth preserves
// the metric ds² + (k*s)² dθ², so slant lengths and arc lengths stay unchanged.
export function developedPoint(kind,s,theta,open){
 if(kind==='cylinder'){
  const bend=1-open;
  return bend<1e-7?[theta,s,0]:[Math.sin(bend*theta)/bend,s,(Math.cos(bend*theta)-1)/bend];
 }
 const k=.5,q=k+(1-k)*open,a=k*theta/q,c=Math.sqrt(Math.max(0,1-q*q));
 return [q*s*Math.sin(a),-s*(c*c+q*q*Math.cos(a)),q*c*s*(Math.cos(a)-1)];
}

export function unfolding(kind,value){
 const capTurn=smooth(value/.24),open=smooth((value-.24)/.76),faces=[],lines=[],labels=[];
 const cylinder=kind==='cylinder',lo=cylinder?-1:kind==='cone'?0:1,hi=cylinder?1:2;
 const point=(s,t)=>developedPoint(kind,s,t,open),n=96;
 for(let i=0;i<n;i++){
  const a=-Math.PI+2*Math.PI*i/n,b=-Math.PI+2*Math.PI*(i+1)/n;
  faces.push(face(lo===0?[point(0,a),point(hi,a),point(hi,b)]:[point(lo,a),point(hi,a),point(hi,b),point(lo,b)]));
 }
 lines.push(line(sample(t=>point(hi,t)),'#355967'));
 if(lo!==0)lines.push(line(sample(t=>point(lo,t)),'#355967'));
 for(const t of [-Math.PI,Math.PI])lines.push(line([point(lo,t),point(hi,t)],'#a35f18',value<.24));
 function disk(s,r,upper){
  const hinge=cylinder?[0,s,0]:[0,-s,0];
  const initial=cylinder?-Math.PI/2:-Math.PI/3;
  const target=upper?0:-Math.PI;
  const angle=initial+(target-initial)*capTurn;
  const p=sample(t=>[r*Math.sin(t),hinge[1]+r*(1-Math.cos(t))*Math.cos(angle),r*(1-Math.cos(t))*Math.sin(angle)]);
  faces.push(face(p,base,true));
  if(value>.995)labels.push(label([0,hinge[1]+r*Math.cos(angle),0],kind==='frustum'?(upper?'πr₁²':'πr₂²'):'πr²','#24664e'));
 }
 if(cylinder){disk(-1,1,false);disk(1,1,true);}
 else {disk(hi,1,false);if(kind==='frustum')disk(lo,.5,true);}
 if(value>.995){
  if(cylinder){
   labels.push(label([0,0,0],'2πrl'),label([-2,1,0],'2πr','#244855',[0,-20]),label([Math.PI,0,0],'l','#244855',[20,0]));
  }else if(kind==='cone'){
   lines.push(line([[0,-.045,0],[0,.045,0]],'#355967'));
   labels.push(label([0,-1,0],'πrl'),label([1,0,0],'l','#244855',[0,-20]),label([Math.SQRT2,-Math.SQRT2,0],'2πr','#244855',[30,6]));
  }else{
   labels.push(label([0,-1.5,0],'π(r₁+r₂)l'),label([1.5,0,0],'l','#244855',[0,-20]));
   labels.push(label([Math.SQRT1_2,-Math.SQRT1_2,0],'2πr₁','#244855',[38,4]),label([Math.SQRT2,-Math.SQRT2,0],'2πr₂','#244855',[36,8]));
  }
 }
 return {faces,lines,labels,unfold:true,open,aria:({cylinder:'圆柱展开为矩形和两个圆',cone:'圆锥展开为扇形和一个圆',frustum:'圆台展开为扇环和两个圆'})[kind]};
}

const square=(r,y)=>[[-r,y,-r],[r,y,-r],[r,y,r],[-r,y,r]];
function shell(bottom,top,color=side){
 return [face(bottom.slice().reverse(),base,true),face(top,cut,true),...bottom.map((p,i)=>face([p,bottom[(i+1)%4],top[(i+1)%4],top[i]],color,true))];
}
function pyramid(bottom,tip,color){return [face(bottom,cut,true),...bottom.map((p,i)=>face([p,bottom[(i+1)%4],tip],color,true))];}
export function volumeMotion(kind,value){
 const faces=[],lines=[],labels=[];
 if(kind.endsWith('section')){
  const cone=kind==='pyramid-section',y=-1+2*value,r=cone?1-value:1;
  const bottom=square(1,-1),top=square(r,y),full=cone?Array(4).fill([0,1,0]):square(1,1);
  faces.push(...shell(bottom,top));
  for(let i=0;i<4;i++)lines.push(line([top[i],full[i]],'#78909b',true));
  if(!cone)lines.push(line([...full,full[0]],'#78909b',true));
  lines.push(line([[2,-1,0],[2,1,0]],'#7651a8',true));
  labels.push(label([2,0,0],'h','#7651a8',[16,0]));
  if(!cone)labels.push(label([0,y,0],'S','#623709'));
  return {faces,lines,labels,aria:cone?'棱锥的平行截面逐渐缩小':'棱柱的平行截面面积保持不变'};
 }
 if(kind==='pyramid-cut'){
  const bottom=square(1,-1),top=square(.5,.5),gap=value*1.6,shift=p=>[p[0],p[1]+gap,p[2]];
  faces.push(...shell(bottom,top),...pyramid(top.map(shift),shift([0,2,0]),purple));
  lines.push(line([[2.1,-1,0],[2.1,.5,0]],'#7651a8',true),line([[-1.4,.5+gap,0],[-1.4,2+gap,0]],'#7651a8',true));
  labels.push(label([2.1,-.25,0],'h','#7651a8',[14,0]),label([-1.4,1.25+gap,0],'t','#7651a8',[-14,0]));
  labels.push(label([0,-1,1],'S₂','#24664e',[0,23]));
  if(value>.1)labels.push(label([0,.5,0],'S₁','#623709',[0,0]));
  return {faces,lines,labels,aria:'大棱锥去掉顶部相似小棱锥，剩下棱台'};
 }
 return null;
}

export function motionModel(kind,value){
 if(kind.startsWith('unfold-'))return unfolding(kind.slice(7),value);
 return volumeMotion(kind,value);
}
