#!/usr/bin/env python3
"""Zero-dependency structural checks for the DGOpenKS learning-page standard."""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]
BRIDGE_ROOT = ROOT / "00_初高中衔接知识"
SYSTEM_CSS = BRIDGE_ROOT / "assets" / "learning-page-system.css"
STANDARD_DOC = ROOT / "docs" / "DGOpenKS_HTML页面统一设计与三端响应式标准.md"
REQUIRED_PUBLIC_ASSETS = (
    SYSTEM_CSS,
    BRIDGE_ROOT / "assets" / "sequence-nav.css",
    BRIDGE_ROOT / "assets" / "sequence-nav.js",
)
LEGACY_CSS_NAME = "formula-page-standard.css"
SCOPED_PREFIXES = (
    "chapter_02-1_",
    "chapter_02-2_",
    "chapter_03_",
    "chapter_04_",
    "chapter_05_",
)
FORBIDDEN_HERO_CLASSES = {
    "lesson-hero",
    "hero-stage",
    "hero-copy",
    "stage-label",
    "stage-expression",
    "stage-note",
    "learning-contract",
}
FORBIDDEN_PRACTICE_TOKENS = {
    "data-practice",
    "data-practice-question",
    "data-practice-feedback",
    "data-answer-list",
    "data-next-question",
    "data-reset-practice",
    "practice-check",
    "practice-lab",
    "practice-question",
    "practice-feedback",
    "practice-reset",
    "practice-actions",
    "answer-button",
    "answer-list",
    "next-button",
}
FORBIDDEN_PRACTICE_TERMS = (
    "练习",
    "自测",
    "作答",
    "题组",
    "答案解析",
    "随机出题",
    "题目生成器",
)

MEDIA_WIDTH_RE = re.compile(
    r"@media[^{]*?\(\s*(?P<kind>min|max)-width\s*:\s*(?P<width>\d+)px\s*\)",
    re.IGNORECASE,
)
STYLESHEET_RE = re.compile(
    r"<link\b[^>]*\brel=[\"']stylesheet[\"'][^>]*\bhref=[\"']([^\"']+)[\"'][^>]*>",
    re.IGNORECASE,
)
H1_CONTENT_RE = re.compile(r"<h1\b[^>]*>(.*?)</h1>", re.IGNORECASE | re.DOTALL)
CSS_COMMENT_RE = re.compile(r"/\*.*?\*/", re.DOTALL)
PUBLIC_PAGE_SELECTORS = {
    "html",
    "body",
    "main",
    "h1",
    "h2",
    ".topbar",
    ".topbar-inner",
    ".topbar-inner::-webkit-scrollbar",
    ".brand",
    ".nav-link",
    ".nav-link:hover",
    ".nav-link:focus-visible",
    '.nav-link[aria-current="page"]',
    ".hero",
    ".hero::after",
    ".eyebrow",
    ".eyebrow::before",
    ".lead",
    ".section",
    ".section-body",
    ".prose",
    ".marker",
    ".marker span",
    ".footer",
    ".pager",
    ".pager a",
    ".pager a:hover",
    ".pager a:focus-visible",
}


def scoped_directories() -> list[Path]:
    return sorted(
        path
        for path in BRIDGE_ROOT.iterdir()
        if path.is_dir() and path.name.startswith(SCOPED_PREFIXES)
    )


def git_indexed_files() -> set[Path]:
    """Return files recorded in the Git index, including staged additions."""
    result = subprocess.run(
        ["git", "ls-files", "-z"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return {
        (ROOT / item).resolve()
        for item in result.stdout.split("\0")
        if item
    }


def media_widths(text: str) -> set[tuple[str, int]]:
    return {
        (match.group("kind").lower(), int(match.group("width")))
        for match in MEDIA_WIDTH_RE.finditer(text)
    }


def resolve_local_reference(source: Path, reference: str) -> Path | None:
    clean = unquote(reference.split("#", 1)[0].split("?", 1)[0]).strip()
    if not clean or clean.startswith(("http://", "https://", "//", "data:")):
        return None
    return (source.parent / clean).resolve()


def public_selector_redefinitions(text: str) -> set[str]:
    """Return exact public selectors redefined by a chapter stylesheet."""
    clean = CSS_COMMENT_RE.sub("", text)
    found: set[str] = set()
    for raw_header in re.findall(r"([^{}]+)\{", clean):
        header = raw_header.strip()
        if not header or header.startswith("@"):
            continue
        for selector in header.split(","):
            normalized = " ".join(selector.split())
            if normalized in PUBLIC_PAGE_SELECTORS:
                found.add(normalized)
    return found


def forbidden_css_classes(text: str) -> set[str]:
    clean = CSS_COMMENT_RE.sub("", text)
    return {
        class_name
        for class_name in FORBIDDEN_HERO_CLASSES
        if re.search(rf"(?<![-\w])\.{re.escape(class_name)}(?![-\w])", clean)
    }


def forbidden_html_classes(text: str) -> set[str]:
    found: set[str] = set()
    for class_value in re.findall(
        r"\bclass\s*=\s*[\"']([^\"']*)[\"']", text, re.IGNORECASE
    ):
        found.update(set(class_value.split()) & FORBIDDEN_HERO_CLASSES)
    return found


def forbidden_practice_tokens(text: str) -> set[str]:
    return {
        token
        for token in FORBIDDEN_PRACTICE_TOKENS
        if re.search(rf"(?<![-\w]){re.escape(token)}(?![-\w])", text)
    }


def forbidden_practice_terms(text: str) -> set[str]:
    return {term for term in FORBIDDEN_PRACTICE_TERMS if term in text}


def main() -> int:
    errors: list[str] = []
    notes: list[str] = []
    indexed_files = git_indexed_files()

    if not STANDARD_DOC.is_file():
        errors.append(f"缺少正式页面标准：{STANDARD_DOC.relative_to(ROOT)}")
    if not SYSTEM_CSS.is_file():
        errors.append(f"缺少公共页面 CSS：{SYSTEM_CSS.relative_to(ROOT)}")
        print("\n".join(f"ERROR {item}" for item in errors))
        return 1

    required_deployment_files = [STANDARD_DOC, *REQUIRED_PUBLIC_ASSETS]
    for required_file in required_deployment_files:
        if required_file.resolve() not in indexed_files:
            errors.append(
                f"部署资源未进入 Git 索引：{required_file.relative_to(ROOT)}"
            )

    system_text = SYSTEM_CSS.read_text(encoding="utf-8")
    approved_widths = media_widths(system_text)
    if not approved_widths:
        errors.append("公共页面 CSS 中没有可识别的响应式断点。")
    forbidden_system = forbidden_css_classes(system_text)
    if forbidden_system:
        errors.append(
            "公共页面 CSS 重新引入了禁止的两栏首屏组件："
            + ", ".join(sorted(forbidden_system))
        )

    legacy_files = list(BRIDGE_ROOT.rglob(LEGACY_CSS_NAME))
    for legacy_file in legacy_files:
        errors.append(
            f"旧公共样式仍然存在：{legacy_file.relative_to(ROOT)}；"
            "应只保留 assets/learning-page-system.css。"
        )

    html_files: list[Path] = []
    css_files: list[Path] = []
    js_files: list[Path] = []
    markdown_files: list[Path] = []
    for directory in scoped_directories():
        html_files.extend(sorted(directory.glob("*.html")))
        css_files.extend(sorted(directory.rglob("*.css")))
        js_files.extend(sorted(directory.rglob("*.js")))
        markdown_files.extend(sorted(directory.glob("*.md")))

    for css_file in css_files:
        text = css_file.read_text(encoding="utf-8")
        relative = css_file.relative_to(ROOT)

        if LEGACY_CSS_NAME in text:
            errors.append(f"{relative} 仍引用旧公共样式名称。")

        practice_tokens = forbidden_practice_tokens(text)
        if practice_tokens:
            errors.append(
                f"{relative} 包含禁止的练习样式："
                + ", ".join(sorted(practice_tokens))
            )

        forbidden = forbidden_css_classes(text)
        if forbidden:
            errors.append(
                f"{relative} 使用了禁止的两栏首屏组件："
                + ", ".join(sorted(forbidden))
            )

        if css_file != SYSTEM_CSS and re.search(r"(^|})\s*:root\s*{", text):
            errors.append(f"{relative} 重新定义了公共 :root 变量。")

        if css_file != SYSTEM_CSS:
            redefined = public_selector_redefinitions(text)
            if redefined:
                errors.append(
                    f"{relative} 重新定义了公共页面选择器："
                    + ", ".join(sorted(redefined))
                )

        unapproved = media_widths(text) - approved_widths
        if unapproved:
            formatted = ", ".join(
                f"{kind}-width:{width}px" for kind, width in sorted(unapproved)
            )
            errors.append(f"{relative} 使用了未批准的全局断点：{formatted}")

    for html_file in html_files:
        text = html_file.read_text(encoding="utf-8")
        relative = html_file.relative_to(ROOT)

        if not re.search(
            r"<meta\b[^>]*\bname=[\"']viewport[\"'][^>]*>", text, re.IGNORECASE
        ):
            errors.append(f"{relative} 缺少 viewport 元信息。")
        if not re.search(r"<h1\b", text, re.IGNORECASE):
            errors.append(f"{relative} 缺少可见的一级标题。")
        for h1_content in H1_CONTENT_RE.findall(text):
            visible_h1 = re.sub(r"<[^>]+>", "", h1_content)
            if "：" in visible_h1 and not re.search(
                r"：(?:\s*</[^>]+>\s*)*<br\b[^>]*>", h1_content, re.IGNORECASE
            ):
                errors.append(f"{relative} 的一级标题没有在冒号后显式换行。")
        if LEGACY_CSS_NAME in text:
            errors.append(f"{relative} 仍引用旧公共样式名称。")

        practice_tokens = forbidden_practice_tokens(text)
        if practice_tokens:
            errors.append(
                f"{relative} 包含禁止的练习结构："
                + ", ".join(sorted(practice_tokens))
            )
        practice_terms = forbidden_practice_terms(text)
        if practice_terms:
            errors.append(
                f"{relative} 包含禁止的练习文案："
                + ", ".join(sorted(practice_terms))
            )

        forbidden = forbidden_html_classes(text)
        if forbidden:
            errors.append(
                f"{relative} 使用了禁止的两栏首屏类："
                + ", ".join(sorted(forbidden))
            )

        unapproved = media_widths(text) - approved_widths
        if unapproved:
            formatted = ", ".join(
                f"{kind}-width:{width}px" for kind, width in sorted(unapproved)
            )
            errors.append(f"{relative} 的页面内样式使用了未批准断点：{formatted}")

        stylesheet_paths: list[Path] = []
        for href in STYLESHEET_RE.findall(text):
            resolved = resolve_local_reference(html_file, href)
            if resolved is None:
                continue
            if not resolved.is_file():
                errors.append(f"{relative} 引用的样式不存在：{href}")
                continue
            stylesheet_paths.append(resolved)

        uses_system = SYSTEM_CSS.resolve() in stylesheet_paths
        if not uses_system:
            for stylesheet in stylesheet_paths:
                stylesheet_text = stylesheet.read_text(encoding="utf-8")
                if "learning-page-system.css" in stylesheet_text:
                    uses_system = True
                    break
        if not uses_system:
            errors.append(f"{relative} 没有接入公共 learning-page-system.css。")

    for js_file in js_files:
        text = js_file.read_text(encoding="utf-8")
        relative = js_file.relative_to(ROOT)
        practice_tokens = forbidden_practice_tokens(text)
        if practice_tokens:
            errors.append(
                f"{relative} 包含禁止的练习逻辑："
                + ", ".join(sorted(practice_tokens))
            )
        practice_terms = forbidden_practice_terms(text)
        if practice_terms:
            errors.append(
                f"{relative} 包含禁止的练习文案："
                + ", ".join(sorted(practice_terms))
            )

    for markdown_file in markdown_files:
        text = markdown_file.read_text(encoding="utf-8")
        relative = markdown_file.relative_to(ROOT)
        practice_terms = forbidden_practice_terms(text)
        if practice_terms:
            errors.append(
                f"{relative} 包含禁止的练习内容："
                + ", ".join(sorted(practice_terms))
            )

    notes.append(f"检查页面：{len(html_files)}")
    notes.append(f"检查章节样式：{len(css_files)}")
    notes.append(f"检查章节脚本：{len(js_files)}")
    notes.append(f"检查核心 Markdown：{len(markdown_files)}")
    notes.append(
        "公共断点："
        + ", ".join(
            f"{kind}-width:{width}px" for kind, width in sorted(approved_widths)
        )
    )

    for note in notes:
        print(f"INFO  {note}")
    if errors:
        for error in errors:
            print(f"ERROR {error}")
        print(f"FAIL  共发现 {len(errors)} 个页面标准问题。")
        return 1

    print("PASS  页面标准结构检查通过。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
