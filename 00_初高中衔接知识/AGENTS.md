# 初高中衔接页面执行入口

本目录继续遵守仓库根目录 `AGENTS.md` 的知识内容、Markdown、HTML 派生和数学准确性要求。

页面结构、视觉系统、响应式行为和完成验收只以：

`../docs/DGOpenKS_HTML页面统一设计与三端响应式标准.md`

为准。不得从旧页面、旧提交或章节私有 CSS 推导另一套标准。

## 强制执行

对 `chapter_02-1` 至 `chapter_05`、其后新建章节，以及本目录下任何新建或重大修改的 HTML 页面：

1. 先读取正式三端标准。
2. 先确认源 Markdown 和 Markdown backflow 状态。
3. 先提交 HTML Derivation Plan；有重大图解或交互时再提交 Interaction / Rendering Plan。
4. 必须接入 `assets/learning-page-system.css`。
5. 章节 CSS 只保留本章特有的数学图解、交互和局部排版。
6. 不得重新定义公共变量、公共组件或未批准的全局断点。
7. 必须实际检查标准规定的五个视口。
8. 必须运行正式标准指定的页面结构检查。
9. 页面实现后必须使用 `$ui-quality-reviewer`。
10. Canvas、WebGL、3D或重型动画页面必须再使用 `$performance-optimizer`。
11. 未提供三端检查结果，不得声明完成。
12. 公共 CSS、导航脚本和页面引用的本地资源必须进入 Git 索引；不得以“本地可渲染”代替部署资源检查。
13. Three.js、渲染器或其他依赖升级不得隐式带入视觉改版；技术升级与公共样式迁移必须分开验收。

修改旧页面时，应删除被公共标准替代的旧规则，不建立长期兼容层。
