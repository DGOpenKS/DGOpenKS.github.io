(() => {
  const $ = id => document.getElementById(id);
  const gcd = (a,b) => b ? gcd(b,a%b) : a;
  function fraction(n,d=1,pi=false) {
    if (!n) return '<mn>0</mn>';
    const g=gcd(Math.abs(n),d); n/=g; d/=g;
    const top=`${n<0?'<mo>−</mo>':''}${Math.abs(n)!==1||!pi?`<mn>${Math.abs(n)}</mn>`:''}${pi?'<mi>π</mi>':''}`;
    return d===1 ? top : `<mfrac><mrow>${top}</mrow><mn>${d}</mn></mfrac>`;
  }
  const math = body => window.dMath(body);
  function update() {
    const a=+$('amplitude').value, w=+$('omega').value, p=+$('phase').value;
    const A=a/2, omega=w/2, phi=p*Math.PI/6;
    const coeff=(n)=>n===2?'':fraction(n,2);
    const phase=p?`<mo>${p<0?'−':'+'}</mo>${fraction(Math.abs(p),6,true)}`:'';
    $('current').innerHTML=math(`<mi>y</mi><mo>=</mo>${coeff(a)}<mi mathvariant="normal">sin</mi><mo>(</mo>${coeff(w)}<mi>x</mi>${phase}<mo>)</mo>`);
    $('a-value').innerHTML=math(fraction(a,2)); $('w-value').innerHTML=math(fraction(w,2)); $('p-value').innerHTML=math(fraction(p,6,true));
    $('range').innerHTML=math(`<mo>[</mo>${fraction(-a,2)}<mo>,</mo>${fraction(a,2)}<mo>]</mo>`);
    $('period').innerHTML=math(fraction(4,w,true)); $('shift').innerHTML=math(fraction(-p,3*w,true));
    $('amplitude').setAttribute('aria-valuetext',String(A)); $('omega').setAttribute('aria-valuetext',String(omega)); $('phase').setAttribute('aria-valuetext',`${p}π/6`);
    $('notes').innerHTML=`<p>振幅：波峰、波谷距横轴 ${math(fraction(a,2))}，只改变纵向大小。</p><p>周期：${math(fraction(4,w,true))}；${w>2?'比基本正弦曲线更密':w<2?'比基本正弦曲线更疏':'与基本正弦曲线一样疏密'}。</p><p>位置：${p===0?'初相为零，两条曲线重合':`相对于虚线向${p>0?'左':'右'}移动 ${math(fraction(Math.abs(p),3*w,true))}`}。</p>`;
    const svg=$('graph'), width=Math.max(280,svg.clientWidth), height=width<500?300:320;
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    const L=34,R=width-24,T=20,B=height-28;
    // Fixed world bounds: x in [-2π,2π], y in [-4,4]. Only the viewport mapping changes.
    const X=x=>L+(x+2*Math.PI)/(4*Math.PI)*(R-L), Y=y=>B-(y+4)/8*(B-T);
    const line=(x1,y1,x2,y2,c,extra='')=>`<line class="${c}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
    const label=(x,y,t,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${t}</text>`;
    let s='<defs><marker id="axis-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--muted)"/></marker></defs>';
    for(let i=-2;i<=2;i++){s+=line(X(i*Math.PI),T,X(i*Math.PI),B,'grid');if(i)s+=label(X(i*Math.PI),Y(0)+22,`${i===-1?'−':i===1?'':i<0?'−2':2}π`);}
    for(let i=-4;i<=4;i++){s+=line(L,Y(i),R,Y(i),'grid');if(i && i%2===0)s+=label(X(0)-9,Y(i)+5,String(i),'end');}
    s+=line(L,Y(0),R+9,Y(0),'axis','marker-end="url(#axis-arrow)"')+line(X(0),B,X(0),T-10,'axis','marker-end="url(#axis-arrow)"');
    s+=label(R+12,Y(0)-10,'x')+label(X(0)+14,T-6,'y')+label(X(0)-9,Y(0)+20,'0','end');
    const path=phase=>Array.from({length:801},(_,i)=>{const x=-2*Math.PI+i/800*4*Math.PI;return `${i?'L':'M'}${X(x).toFixed(2)},${Y(A*Math.sin(omega*x+phase)).toFixed(2)}`;}).join(' ');
    s+=`<path class="secondary" stroke-dasharray="6 5" opacity=".72" d="${path(0)}"/><path class="curve" d="${path(phi)}"/>`;
    svg.innerHTML=s;
  }
  for(const id of ['amplitude','omega','phase']) $(id).addEventListener('input',update);
  $('reset').addEventListener('click',()=>{$('amplitude').value=2;$('omega').value=2;$('phase').value=0;update();});
  const start = () => { update(); new ResizeObserver(update).observe($('graph')); };
  if(window.MathJax?.startup?.promise) MathJax.startup.promise.then(start);
  else start();
})();
