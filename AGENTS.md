## Codex Skills Workflow

Global skills are stored in `~/.agents/skills/`.

Use:
- `$design-reference-curator` before major DGOpenKS page redesigns to choose references and visual direction.
- `$ui-quality-reviewer` after DGOpenKS page implementation to review UI polish, learning clarity, interaction quality, motion restraint, and mobile readiness.
- `$hyperframes` for video generation.
- `$content-to-video` for converting docs or articles into storyboard/video plans.
- `$blog-to-video` for turning blog posts into short video drafts without modifying the original blog.
- `$frontend-animation` for UI animation.
- `$gsap-motion` for GSAP timelines.
- `$framer-motion` for React animation.

## DGOpenKS Design Workflow

For major page redesigns:
1. Use `$design-reference-curator` first.
2. Use relevant implementation skills as needed: `$interaction-architect`, `$math-visualization`, `$motion-design-system`, `$frontend-animation`, `$gsap-motion`, `$performance-optimizer`.
3. Implement the page.
4. Use `$ui-quality-reviewer` after implementation.
5. Only then ask the user to review in browser.

Rules:
- Do not rewrite blog posts unless explicitly asked.
- Do not modify existing Markdown chapters when generating videos.
- Put generated video drafts in a separate directory.
- Prefer small, local changes.
- Before editing, identify the target file.
- After editing, summarize changed files.
- Skills may analyze any page.
- Skills may propose modifications.
- Skills must not directly modify existing chapter content, mathematical derivations, interaction logic, or existing animations unless explicitly requested.
