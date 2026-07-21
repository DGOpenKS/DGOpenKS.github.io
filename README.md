# DGOpenKS

DGOpenKS 是一个以 Markdown 为知识源、以静态 HTML 为学习页面的数学开放知识项目。视频和动画是从知识内容派生的独立产物，不应改写源章节。

## 本地环境

- Node.js 22 或更高版本（推荐使用 `.node-version` 声明的版本）
- Python 3.9 或更高版本
- VS Code 与仓库推荐扩展
- 生成视频时另需 FFmpeg 和 HyperFrames

首次配置：

```bash
npm install
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-dev.txt
```

## 内容检查

```bash
npm run check
```

该命令会执行：

- Markdown/HTML 数学分隔符与 KaTeX 渲染检查；
- 结构化练习样例的 Schema 检查；
- 基于 SymPy 的代数等价性检查。
- 本地页面链接与静态资源路径检查。

运行包含浏览器页面冒烟测试的完整检查：

```bash
npm run check:all
```

页面测试使用本机安装的 Google Chrome，不需要额外下载 Chromium。

在 VS Code 中也可以运行默认测试任务 `DGOpenKS: 全部检查`。

## 页面预览

安装仓库推荐的 Live Server 扩展后，可从目标 `index.html` 启动本地预览。

## 视频工作流

视频文件必须与知识源分开存放。详细约束与 HyperFrames 命令参见 [docs/video-workflow.md](docs/video-workflow.md)。
