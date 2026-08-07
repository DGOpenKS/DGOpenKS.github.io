(function(){
  "use strict";

  const script=document.currentScript;
  if(!script||document.querySelector("[data-sequence-navigation]"))return;

  const root=new URL("../",script.src);
  const sequence=[
    {path:"chapter_00_江西中考数学快速回顾特辑/chapter00-1_代数与函数快速回顾/index.html",title:"00-1 代数与函数快速回顾",menu:"../index.html",menuTitle:"OpenKS 总目录"},
    {path:"chapter_00_江西中考数学快速回顾特辑/chapter00-2_几何与综合快速回顾/index.html",title:"00-2 几何与综合快速回顾",menu:"../index.html",menuTitle:"OpenKS 总目录"},
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
    {path:"chapter_03_多项式变形与因式分解/02_分组分解法.html",title:"02 分组分解法",menu:"chapter_03_多项式变形与因式分解/index.html",menuTitle:"Chapter 03"},
    {path:"chapter_03_多项式变形与因式分解/03_十字相乘法.html",title:"03 十字相乘法",menu:"chapter_03_多项式变形与因式分解/index.html",menuTitle:"Chapter 03"},
    {path:"chapter_03_多项式变形与因式分解/04_求根公式法.html",title:"04 求根公式法",menu:"chapter_03_多项式变形与因式分解/index.html",menuTitle:"Chapter 03"},
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

  const chapters=[
    {
      prefix:"chapter_00_江西中考数学快速回顾特辑/",
      title:"Chapter 00",
      home:"chapter_00_江西中考数学快速回顾特辑/chapter00-1_代数与函数快速回顾/index.html",
      pages:[
        {path:"chapter_00_江西中考数学快速回顾特辑/chapter00-2_几何与综合快速回顾/index.html",title:"00-2 几何与综合"}
      ]
    },
    {
      prefix:"chapter_01_初高中数学思维衔接/",
      title:"Chapter 01",
      home:"chapter_01_初高中数学思维衔接/index.html",
      pages:[]
    },
    {
      prefix:"chapter_02-1_完全平方与平方差公式/",
      title:"Chapter 02-1",
      home:"chapter_02-1_完全平方与平方差公式/index.html",
      pages:[]
    },
    {
      prefix:"chapter_02-2_立方相关公式/",
      title:"Chapter 02-2",
      home:"chapter_02-2_立方相关公式/index.html",
      pages:[
        {path:"chapter_02-2_立方相关公式/01_和的立方.html",title:"01 和的立方"},
        {path:"chapter_02-2_立方相关公式/02_差的立方.html",title:"02 差的立方"},
        {path:"chapter_02-2_立方相关公式/03_立方和.html",title:"03 立方和"},
        {path:"chapter_02-2_立方相关公式/04_立方差.html",title:"04 立方差"},
        {path:"chapter_02-2_立方相关公式/05_立方公式小结.html",title:"05 公式小结"}
      ]
    },
    {
      prefix:"chapter_03_多项式变形与因式分解/",
      title:"Chapter 03",
      home:"chapter_03_多项式变形与因式分解/index.html",
      pages:[
        {path:"chapter_03_多项式变形与因式分解/01_因式分解.html",title:"01 因式分解"},
        {path:"chapter_03_多项式变形与因式分解/02_分组分解法.html",title:"02 分组分解"},
        {path:"chapter_03_多项式变形与因式分解/03_十字相乘法.html",title:"03 十字相乘"},
        {path:"chapter_03_多项式变形与因式分解/04_求根公式法.html",title:"04 求根公式"}
      ]
    },
    {
      prefix:"chapter_04_分式根式与条件控制/",
      title:"Chapter 04",
      home:"chapter_04_分式根式与条件控制/index.html",
      pages:[
        {path:"chapter_04_分式根式与条件控制/01_分式的意义条件与约分.html",title:"01 分式基础"},
        {path:"chapter_04_分式根式与条件控制/02_分式的四则运算.html",title:"02 分式运算"},
        {path:"chapter_04_分式根式与条件控制/03_二次根式的意义与化简.html",title:"03 根式基础"},
        {path:"chapter_04_分式根式与条件控制/04_根式的四则运算.html",title:"04 根式运算"},
        {path:"chapter_04_分式根式与条件控制/05_分母有理化.html",title:"05 分母有理化"},
        {path:"chapter_04_分式根式与条件控制/06_根式与分数指数幂.html",title:"06 分数指数"},
        {path:"chapter_04_分式根式与条件控制/07_复合条件与等价化简.html",title:"07 复合条件"}
      ]
    }
  ];

  const currentPath=decodeURIComponent(window.location.pathname);

  function topbarLink(className,label,path,isCurrent){
    const anchor=document.createElement("a");
    anchor.className=className;
    anchor.href=new URL(path,root).href;
    anchor.textContent=label;
    if(isCurrent)anchor.setAttribute("aria-current","page");
    return anchor;
  }

  function normalizeTopbar(){
    const topbar=document.querySelector(".topbar");
    const chapter=chapters.find((item)=>currentPath.includes("/"+item.prefix));
    if(!topbar||!chapter)return;

    const currentItem=[{path:chapter.home},...chapter.pages]
      .find((item)=>currentPath.endsWith("/"+item.path));
    const inner=document.createElement("div");
    inner.className="topbar-inner";
    const brand=topbarLink("brand","","../index.html",false);
    brand.setAttribute("aria-label","OpenKS 首页");
    const brandImage=document.createElement("img");
    brandImage.src=new URL("../assets/brand/openks-lockup-a-primary.svg",root).href;
    brandImage.alt="";
    brandImage.width=2947;
    brandImage.height=716;
    brand.append(brandImage);
    inner.append(brand);
    inner.append(topbarLink(
      "nav-link",
      chapter.title,
      chapter.home,
      !currentItem||currentItem.path===chapter.home
    ));
    chapter.pages.forEach((page)=>{
      inner.append(topbarLink(
        "nav-link",
        page.title,
        page.path,
        currentItem?.path===page.path
      ));
    });
    topbar.replaceChildren(inner);
    const currentLink=inner.querySelector('[aria-current="page"]');
    if(currentLink){
      requestAnimationFrame(()=>{
        inner.scrollLeft=Math.max(
          0,
          currentLink.offsetLeft-(inner.clientWidth-currentLink.offsetWidth)/2
        );
      });
    }
  }

  normalizeTopbar();

  const index=sequence.findIndex((item)=>currentPath.endsWith("/"+item.path));
  if(index<0)return;

  // 新标准页面已经在 HTML 中写明完整的页底导航。
  // 保留静态结构，避免脚本再次替换成另一套按钮和文案。
  if(document.querySelector("body > .pager"))return;

  const style=document.createElement("link");
  style.rel="stylesheet";
  style.href=new URL("sequence-nav.css?v=20260808-2",script.src).href;
  document.head.appendChild(style);

  const previous=index>0?sequence[index-1]:null;
  const next=index<sequence.length-1?sequence[index+1]:null;

  function link(kind,item,label){
    const anchor=document.createElement("a");
    anchor.className="pager-"+kind;
    anchor.href=new URL(item.path,root).href;
    anchor.textContent=label;
    return anchor;
  }

  const nav=document.createElement("nav");
  nav.className="pager";
  nav.dataset.sequenceNavigation="";
  nav.setAttribute("aria-label","章节导航");
  if(previous)nav.append(link("prev",previous,"← 上一章 · "+previous.title));
  nav.append(link("home",{path:"../index.html"},"返回知识首页"));
  if(next)nav.append(link("next",next,"下一章 · "+next.title+" →"));

  const footer=document.querySelector("body > footer.footer");
  document.body.insertBefore(nav,footer||null);
})();
