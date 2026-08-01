(function(){
  "use strict";

  const script=document.currentScript;
  if(!script||document.querySelector("[data-sequence-navigation]"))return;

  const root=new URL("../",script.src);
  const sequence=[
    {path:"chapter_00_江西中考数学快速回顾特辑/chapter00-1_代数与函数快速回顾/index.html",title:"00-1 代数与函数快速回顾",menu:"../index.html",menuTitle:"DGOpenKS 总目录"},
    {path:"chapter_00_江西中考数学快速回顾特辑/chapter00-2_几何与综合快速回顾/index.html",title:"00-2 几何与综合快速回顾",menu:"../index.html",menuTitle:"DGOpenKS 总目录"},
    {path:"chapter_01_初高中数学思维衔接/index.html",title:"Chapter 01 初高中数学思维衔接",menu:"chapter_01_初高中数学思维衔接/index.html",menuTitle:"Chapter 01"},
    {path:"chapter_02-1_完全平方与平方差公式/index.html",title:"Chapter 02-1 完全平方与平方差公式",menu:"chapter_02-1_完全平方与平方差公式/index.html",menuTitle:"Chapter 02-1"},
    {path:"chapter_02-2_立方相关公式/index.html",title:"Chapter 02-2 立方相关公式",menu:"chapter_02-2_立方相关公式/index.html",menuTitle:"Chapter 02-2"},
    {path:"chapter_02-2_立方相关公式/01_和的立方.html",title:"01 和的立方",menu:"chapter_02-2_立方相关公式/index.html",menuTitle:"Chapter 02-2"},
    {path:"chapter_02-2_立方相关公式/02_差的立方.html",title:"02 差的立方",menu:"chapter_02-2_立方相关公式/index.html",menuTitle:"Chapter 02-2"},
    {path:"chapter_02-2_立方相关公式/03_立方和.html",title:"03 立方和",menu:"chapter_02-2_立方相关公式/index.html",menuTitle:"Chapter 02-2"},
    {path:"chapter_02-2_立方相关公式/04_立方差.html",title:"04 立方差",menu:"chapter_02-2_立方相关公式/index.html",menuTitle:"Chapter 02-2"},
    {path:"chapter_02-2_立方相关公式/05_立方公式小结.html",title:"05 立方公式小结",menu:"chapter_02-2_立方相关公式/index.html",menuTitle:"Chapter 02-2"},
    {path:"chapter_03_多项式变形与因式分解/index.html",title:"Chapter 03 多项式变形与因式分解",menu:"chapter_03_多项式变形与因式分解/index.html",menuTitle:"Chapter 03"},
    {path:"chapter_03_多项式变形与因式分解/01_因式分解.html",title:"01 因式分解",menu:"chapter_03_多项式变形与因式分解/index.html",menuTitle:"Chapter 03"},
    {path:"chapter_03_多项式变形与因式分解/02_十字相乘法.html",title:"02 十字相乘法",menu:"chapter_03_多项式变形与因式分解/index.html",menuTitle:"Chapter 03"},
    {path:"chapter_03_多项式变形与因式分解/03_求根公式法.html",title:"03 求根公式法",menu:"chapter_03_多项式变形与因式分解/index.html",menuTitle:"Chapter 03"},
    {path:"chapter_04_分式根式与条件控制/index.html",title:"Chapter 04 分式根式与条件控制",menu:"chapter_04_分式根式与条件控制/index.html",menuTitle:"Chapter 04"},
    {path:"chapter_04_分式根式与条件控制/01_分式化简.html",title:"01 分式的特点与化简",menu:"chapter_04_分式根式与条件控制/index.html",menuTitle:"Chapter 04"},
    {path:"chapter_04_分式根式与条件控制/02_根式化简.html",title:"02 根式的特点与化简",menu:"chapter_04_分式根式与条件控制/index.html",menuTitle:"Chapter 04"},
    {path:"chapter_04_分式根式与条件控制/03_复合条件.html",title:"03 复合条件",menu:"chapter_04_分式根式与条件控制/index.html",menuTitle:"Chapter 04"},
    {path:"chapter_04_分式根式与条件控制/04_等价化简小结.html",title:"04 等价化简小结",menu:"chapter_04_分式根式与条件控制/index.html",menuTitle:"Chapter 04"},
    {path:"chapter_05_方程不等式与约束/index.html",title:"Chapter 05 方程不等式与约束",menu:"chapter_05_方程不等式与约束/index.html",menuTitle:"Chapter 05"},
    {path:"chapter_05_方程不等式与约束/01_方程变形.html",title:"01 方程变形",menu:"chapter_05_方程不等式与约束/index.html",menuTitle:"Chapter 05"},
    {path:"chapter_05_方程不等式与约束/02-1_分式方程.html",title:"02-1 分式方程",menu:"chapter_05_方程不等式与约束/index.html",menuTitle:"Chapter 05"},
    {path:"chapter_05_方程不等式与约束/02-2_根式方程.html",title:"02-2 根式方程",menu:"chapter_05_方程不等式与约束/index.html",menuTitle:"Chapter 05"},
    {path:"chapter_05_方程不等式与约束/03_不等式变形.html",title:"03 不等式变形",menu:"chapter_05_方程不等式与约束/index.html",menuTitle:"Chapter 05"},
    {path:"chapter_05_方程不等式与约束/04_二次不等式.html",title:"04 二次不等式",menu:"chapter_05_方程不等式与约束/index.html",menuTitle:"Chapter 05"},
    {path:"chapter_05_方程不等式与约束/05_分式不等式.html",title:"05 分式不等式",menu:"chapter_05_方程不等式与约束/index.html",menuTitle:"Chapter 05"},
    {path:"chapter_05_方程不等式与约束/06_小结.html",title:"06 全章小结",menu:"chapter_05_方程不等式与约束/index.html",menuTitle:"Chapter 05"}
  ];

  const currentPath=decodeURIComponent(window.location.pathname);
  const index=sequence.findIndex((item)=>currentPath.endsWith("/"+item.path));
  if(index<0)return;

  const style=document.createElement("link");
  style.rel="stylesheet";
  style.href=new URL("sequence-nav.css",script.src).href;
  document.head.appendChild(style);

  const current=sequence[index];
  const previous=index>0
    ?{...sequence[index-1],eyebrow:"上一篇"}
    :{path:"../index.html",title:"DGOpenKS 总目录",eyebrow:"返回目录"};
  const next=index<sequence.length-1
    ?{...sequence[index+1],eyebrow:"下一篇"}
    :{path:"../index.html",title:"返回 DGOpenKS 总目录",eyebrow:"完成学习"};

  function link(kind,item){
    const anchor=document.createElement("a");
    anchor.className="sequence-nav__link sequence-nav__link--"+kind;
    anchor.href=new URL(item.path,root).href;
    const copy=document.createElement("span");
    copy.className="sequence-nav__copy";
    const eyebrow=document.createElement("span");
    eyebrow.className="sequence-nav__eyebrow";
    eyebrow.textContent=item.eyebrow;
    const title=document.createElement("strong");
    title.className="sequence-nav__title";
    title.textContent=item.title;
    copy.append(eyebrow,title);
    const arrow=document.createElement("span");
    arrow.className="sequence-nav__arrow";
    arrow.setAttribute("aria-hidden","true");
    arrow.textContent=kind==="prev"?"←":kind==="next"?"→":"";
    if(kind==="prev")anchor.append(arrow,copy);
    else anchor.append(copy,arrow);
    return anchor;
  }

  const nav=document.createElement("nav");
  nav.className="sequence-nav";
  nav.dataset.sequenceNavigation="";
  nav.setAttribute("aria-label","连续阅读导航");
  nav.append(
    link("prev",previous),
    link("menu",{path:current.menu,title:current.menuTitle,eyebrow:"章节入口"}),
    link("next",next)
  );

  document.querySelectorAll("body > .pager").forEach((pager)=>pager.remove());
  const footer=document.querySelector("body > footer.footer");
  document.body.insertBefore(nav,footer||null);
})();
