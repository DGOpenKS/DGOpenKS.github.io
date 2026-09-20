/* Shared, dependency-free diagrams for D06–09. Angles are in radians. */
(() => {
  const PI = Math.PI, TAU = 2 * PI;
  const line = (x,y,a,b,c='axis') => `<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" class="${c}"/>`;
  const label = (x,y,t) => `<text x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
  const dot = (x,y,other=false) => `<circle cx="${x}" cy="${y}" r="7" class="${other?'other':'spot'}"/>`;
  const num = x => Math.abs(x)<1e-9?'0':String(+x.toFixed(3));
  const math = s => window.dMath(s);
  const equals = x => [0,.5,1,Math.sqrt(2)/2,Math.sqrt(3)/2,Math.sqrt(3)/3,Math.sqrt(3)].some(v=>Math.abs(Math.abs(x)-v)<1e-8)?'<mo>=</mo>':'<mo>≈</mo>';
  const mn = x => `<mn>${x}</mn>`;
  const value = x => {
    if (!Number.isFinite(x)) return '<mtext>无定义</mtext>';
    let a=Math.abs(x), body=mn(num(a));
    for(const [v,n,d] of [[.5,'1','2'],[Math.sqrt(2)/2,'√2','2'],[Math.sqrt(3)/2,'√3','2'],[Math.sqrt(3)/3,'√3','3'],[Math.sqrt(3),'√3',null]]) {
      if(Math.abs(a-v)<1e-8){const top=n.startsWith('√')?`<msqrt>${mn(n.slice(1))}</msqrt>`:mn(n);body=d?`<mfrac>${top}${mn(d)}</mfrac>`:top;break;}
    }
    return (x< -1e-9?'<mo>−</mo>':'')+body;
  };
  const rad = x => {
    const n=Math.round(x/PI*180); let a=Math.abs(n),b=180;
    if(Math.abs(x-n*PI/180)>1e-8)return math(mn(num(x)))+' rad';
    if(!a)return math(mn(0));
    const gcd=(x,y)=>y?gcd(y,x%y):x,g=gcd(a,b);a/=g;b/=g;
    const top=(a===1?'':mn(a))+'<mi>π</mi>';
    return math((n<0?'<mo>−</mo>':'')+(b===1?top:`<mfrac><mrow>${top}</mrow>${mn(b)}</mfrac>`));
  };
  function circle(a, second=null, tangent=false) {
    const cx=205,cy=185,r=115, px=cx+r*Math.cos(a),py=cy-r*Math.sin(a);
    let s='';
    for(let k=-1;k<=1;k+=.5)s+=line(cx+k*r,40,cx+k*r,330,'grid')+line(45,cy+k*r,375,cy+k*r,'grid');
    s+=line(40,cy,380,cy)+line(cx,335,cx,30)+`<path class="axis" d="M374 ${cy-4}L380 ${cy}L374 ${cy+4} M${cx-4} 36L${cx} 30L${cx+4} 36"/>`+label(385,cy-10,'x')+label(cx+15,27,'y')+label(cx-13,cy+22,'O');
    s+=`<circle cx="${cx}" cy="${cy}" r="${r}" class="axis"/>`;
    s+=line(cx,cy,px,py,'curve')+line(px,py,px,cy,'guide')+line(px,py,cx,py,'guide');
    const angleArc=(angle,radius,cls)=>{
      let path='';const end=Math.max(-TAU,Math.min(TAU,angle));
      for(let i=0;i<=80;i++){let t=end*i/80;path+=(i?'L':'M')+(cx+radius*Math.cos(t))+','+(cy-radius*Math.sin(t));}
      return `<path d="${path}" class="${cls}"/>`;
    };
    s+=angleArc(a,32,'curve')+label(cx+(second===null?47:67)*Math.cos(a/2),cy-(second===null?47:67)*Math.sin(a/2),'α');
    if(second!==null){let qx=cx+r*Math.cos(second),qy=cy-r*Math.sin(second);s+=line(cx,cy,qx,qy,'secondary')+angleArc(second,48,'secondary')+dot(qx,qy,true)+label(qx+15,qy+24,'Q');}
    if(tangent){
      const y=Math.tan(a),ty=cy-r*y;
      s+=line(cx+r,30,cx+r,340,'guide')+label(cx+r,360,'x = 1');
      // Clip the ray; do not substitute a boundary point for off-screen T.
      let t=Math.min(1,145/(r*Math.max(Math.abs(y),1e-10)));
      s+=line(cx,cy,cx+r*t,cy-r*y*t,'secondary');
      if(ty>=30&&ty<=330)s+=dot(cx+r,ty,true)+label(cx+r+18,ty-9,'T');
      else s+=label(205,22,'T 超出图示范围');
    }
    return s+dot(px,py)+label(px+(Math.cos(a)>=0?16:-16),py-12,'P');
  }
  function graph(svg, fn, opts={}) {
    const w=svg.viewBox.baseVal.width,h=svg.viewBox.baseVal.height;
    const lo=opts.lo??-2*PI,hi=opts.hi??2*PI,ym=opts.ym??1.5;
    const X=x=>42+(w-64)*(x-lo)/(hi-lo),Y=y=>h/2-y*(h-70)/(2*ym);
    let s='';
    for(let k=Math.ceil(lo/(PI/2));k<=Math.floor(hi/(PI/2));k++){
      let x=k*PI/2;s+=line(X(x),28,X(x),h-30,'grid');
      if(k%2===0)s+=label(X(x),h/2+23,k===0?'0':(k===2?'π':k===-2?'−π':`${k/2}π`));
    }
    for(let y=-Math.floor(ym);y<=ym;y++)s+=line(32,Y(y),w-15,Y(y),'grid')+(y?label(22,Y(y)+5,y):'');
    s+=line(32,Y(0),w-12,Y(0))+line(X(0),h-25,X(0),20)+`<path class="axis" d="M${w-18} ${Y(0)-4}L${w-12} ${Y(0)}L${w-18} ${Y(0)+4} M${X(0)-4} 26L${X(0)} 20L${X(0)+4} 26"/>`+label(w-12,Y(0)-10,'x')+label(X(0)+15,19,'y');
    const path=(a,b,cls)=>{
      let d='',active=false;
      for(let i=0;i<=350;i++){let x=a+(b-a)*i/350,y=fn(x);if(!Number.isFinite(y)||Math.abs(y)>ym){active=false;continue;}d+=(active?'L':'M')+X(x)+','+Y(y);active=true;}
      return `<path d="${d}" class="${cls}"/>`;
    };
    if(opts.tangent){
      for(let k=-2;k<=2;k++){
        let a=Math.max(lo,-PI/2+k*PI+.0001),b=Math.min(hi,PI/2+k*PI-.0001);
        if(a<b)s+=path(a,b,'curve');
        let x=PI/2+k*PI;if(x>=lo&&x<=hi)s+=line(X(x),25,X(x),h-25,'asymptote');
      }
    } else if(opts.monotone){
      let cuts=[lo];for(let k=-5;k<=5;k++){let x=(opts.cos?0:PI/2)+k*PI;if(x>lo&&x<hi)cuts.push(x);}cuts.push(hi);cuts.sort((a,b)=>a-b);
      for(let i=1;i<cuts.length;i++){const a=cuts[i-1],b=cuts[i];s+=path(a,b,fn(a+(b-a)*.6)>fn(a+(b-a)*.4)?'inc':'dec');}
    } else s+=path(lo,hi,'curve');
    if(opts.axis!==undefined)s+=line(X(opts.axis),25,X(opts.axis),h-25,'asymptote');
    if(opts.center!==undefined)s+=dot(X(opts.center),Y(0),true);
    (opts.points||[]).forEach((x,i)=>{let y=fn(x);if(Math.abs(y)<=ym)s+=line(X(x),Y(y),X(x),Y(0),'guide')+dot(X(x),Y(y),i>0);});
    svg.innerHTML=s;
    return {X,Y,lo,hi,w};
  }
  document.querySelectorAll('[data-lab]').forEach(lab=>{
    const kind=lab.dataset.lab,svg=lab.querySelector('.lab-primary'),other=lab.querySelector('.lab-secondary'),out=lab.querySelector('.lab-output');
    let a=PI/6, mode=2, f='sin',view='period',offset=PI/3,drag=false;
    const initial=()=>{a=kind==='tangent'?PI/4:PI/6;mode=2;f='sin';view='period';offset=PI/3;};
    function render(){
      let fn=f==='sin'?Math.sin:Math.cos;
      if(kind==='induction'){
        const beta=[a+TAU,-a,PI+a,PI-a,PI/2+a,PI/2-a][mode];
        svg.innerHTML=circle(a,beta);
        const A='<mi>α</mi>',P='<mi>π</mi>',half='<mfrac>'+P+'<mn>2</mn></mfrac>';
        const angleNames=[A+'<mo>+</mo><mn>2</mn>'+P,'<mo>−</mo>'+A,P+'<mo>+</mo>'+A,P+'<mo>−</mo>'+A,half+'<mo>+</mo>'+A,half+'<mo>−</mo>'+A];
        const F=(name,arg)=>'<mrow><mi mathvariant="normal">'+name+'</mi><mo>(</mo>'+arg+'<mo>)</mo></mrow>';
        const sinNames=[F('sin',A),'<mo>−</mo>'+F('sin',A),'<mo>−</mo>'+F('sin',A),F('sin',A),F('cos',A),F('cos',A)];
        const cosNames=[F('cos',A),F('cos',A),'<mo>−</mo>'+F('cos',A),'<mo>−</mo>'+F('cos',A),'<mo>−</mo>'+F('sin',A),F('sin',A)];
        const explain=['转一整圈，回到原点。','关于 x 轴对称，纵坐标变号。','转半圈，横、纵坐标都变号。','关于 y 轴对称，横坐标变号。','转四分之一圈，坐标角色交换，新横坐标变号。','关于直线 y = x 对称，横、纵坐标交换。'];
        out.innerHTML=`α = ${rad(a)}。${explain[mode]}<br>${math(F('sin',angleNames[mode])+'<mo>=</mo>'+sinNames[mode]+equals(Math.sin(beta))+value(Math.sin(beta)))}<br>${math(F('cos',angleNames[mode])+'<mo>=</mo>'+cosNames[mode]+equals(Math.cos(beta))+value(Math.cos(beta)))}`;
      }else if(kind==='waves'){
        svg.innerHTML=circle(a);
        graph(other,fn,{lo:-PI,hi:3*PI,points:[a]});
        out.innerHTML=`角 α = ${rad(a)}，${math('<mi mathvariant="normal">'+f+'</mi><mi>α</mi>'+equals(fn(a))+value(fn(a)))}。曲线上点的横坐标是角 α，纵坐标是圆上点的${f==='sin'?'纵':'横'}坐标。`;
      }else if(kind==='properties'){
        let c=f==='sin'?PI/2:0,p=-offset,q=p+TAU,opts={};
        if(view==='axis'){p=c-offset;q=c+offset;opts.axis=c;}
        if(view==='center'){c=f==='sin'?0:PI/2;p=c-offset;q=c+offset;opts.center=c;}
        if(view==='monotone'){p=-offset;q=offset;opts.monotone=true;opts.cos=f==='cos';}
        graph(svg,fn,{...opts,points:view==='monotone'?[p]:[p,q]});
        const messages={period:'两点横坐标相差 2π，函数值相同。',axis:`两点关于直线 x = ${rad(c)} 对称，函数值相同。`,center:`两点关于 (${rad(c)}, 0) 中心对称，函数值互为相反数。`,monotone:'沿横轴从左往右看：蓝色段递增，紫色段递减。'};
        out.innerHTML=`${math('<mi>y</mi><mo>=</mo><mi mathvariant="normal">'+f+'</mi><mi>x</mi>')}。${messages[view]}<br>蓝点：x = ${rad(p)}，${math('<mi>y</mi>'+equals(fn(p))+value(fn(p)))}。`;
      }else{
        svg.innerHTML=circle(a,null,true);
        graph(other,Math.tan,{lo:-1.5*PI,hi:1.5*PI,ym:4,tangent:true,points:[a]});
        out.innerHTML=`α = ${rad(a)}，${math('<mi mathvariant="normal">tan</mi><mi>α</mi>'+equals(Math.tan(a))+value(Math.tan(a)))}。${Math.abs(Math.tan(a))>4?'当前值超出右图显示范围。':''}<br>虚线所在位置无定义；每一支都递增，但不能跨过断点比较单调性。`;
      }
      lab.querySelectorAll('[data-fn]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.fn===f));
      lab.querySelectorAll('[data-transform]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.transform===mode));
      lab.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===view));
      svg.setAttribute('aria-label',kind==='properties'?'函数性质图，可用左右方向键移动观察点':`可拖动的单位圆，当前角 ${num(a*180/PI)} 度，也可用左右方向键调节`);
    }
    lab.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
      if(b.hasAttribute('data-reset'))initial();
      if(b.dataset.fn)f=b.dataset.fn;
      if(b.dataset.view)view=b.dataset.view;
      if(b.dataset.transform!==undefined)mode=+b.dataset.transform;
      if(b.dataset.deg!==undefined)a=+b.dataset.deg*PI/180;
      render();
    });
    function move(e){
      const pt=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());
      if(kind==='properties'){const x=(pt.x-42)/(svg.viewBox.baseVal.width-64)*4*PI-2*PI;const c=view==='axis'?(f==='sin'?PI/2:0):view==='center'?(f==='sin'?0:PI/2):0;offset=Math.max(PI/180,Math.min(PI/2,c-x));}
      else{
        let n=Math.atan2(185-pt.y,pt.x-205);
        if(kind==='tangent')n=Math.max(-89*PI/180,Math.min(89*PI/180,n));
        else if(n<0)n+=TAU;
        a=Math.round(n*180/PI)*PI/180;
      }render();
    }
    svg.setAttribute('tabindex','0');
    svg.addEventListener('pointerdown',e=>{drag=true;svg.setPointerCapture(e.pointerId);move(e);});
    svg.addEventListener('pointermove',e=>{if(drag)move(e);});
    svg.addEventListener('pointerup',()=>drag=false);svg.addEventListener('pointercancel',()=>drag=false);
    svg.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const d=['ArrowLeft','ArrowDown'].includes(e.key)?-PI/180:PI/180;
      if(kind==='properties')offset=Math.max(PI/180,Math.min(PI/2,offset+d));
      else a=kind==='tangent'?Math.max(-89*PI/180,Math.min(89*PI/180,a+d)):(a+d+TAU)%TAU;
      render();});
    initial();render();
    window.addEventListener('load',()=>window.MathJax?.startup?.promise.then(render));
  });
})();
