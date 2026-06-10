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
- All practice questions should be generated randomly when practical, and each practice generator must stay focused on the corresponding knowledge point.
- Skills may analyze any page.
- Skills may propose modifications.
- Skills must not directly modify existing chapter content, mathematical derivations, interaction logic, or existing animations unless explicitly requested.

## DGOpenKS Core Teaching Markdown Standard

From now on, DGOpenKS work should follow this order unless the user explicitly changes the standard:

1. Write the core teaching Markdown first.
2. Design the page from that Markdown afterward.

Core teaching Markdown is not a normal article, not a tutoring handout, not a page implementation note, and not a video script. Its only task is to design the learning logic of one mathematical idea clearly so users can genuinely understand the mathematics.

Rules:
- Each Markdown file must focus on one clear core learning question.
- If the content becomes too broad, split it into smaller sections such as 02-1 and 02-2.
- Keep Markdown short, clear, and logically strong. Do not write long teaching essays.
- First analyze why students find the idea difficult.
- Make clear what students tend to misunderstand, why that misunderstanding happens, and which mathematical structure correct understanding depends on.
- Do not pile up formulas at the beginning.
- Use this order: problem -> misconception -> structure -> observation -> formula -> practice.
- For images and interactions, write only the teaching intention. Do not write frontend implementation details.
- Do not include HTML, CSS, JavaScript, Three.js, GSAP, button styling, animation implementation, or other page engineering details.
- Do not write video content. Do not include shots, narration, subtitles, transitions, or background music.
- Markdown is not the full page copy. Later pages should use it as design basis and only keep what students need to read, observe, operate, and practice.
- Practice design should specify randomizable question families whenever practical. Each generated question must directly serve the section's core knowledge point and should include targeted feedback for common errors.

Required Markdown structure:

```markdown
# Title

> This document is DGOpenKS core teaching Markdown.
> It is not a normal article, not a page implementation note, and not a video script.
> Its task is to design the learning logic of one mathematical topic clearly so users can understand the mathematics more easily.

## 1. Core Learning Question

What single problem does this section solve?

## 2. Student Misunderstandings

What do students tend to misunderstand?
Why does that misunderstanding happen?

## 3. Key Mathematical Structure

What structure should students really see?
Why does this structure explain the problem?

## 4. Learning Path

How should students understand it step by step?
Use only 4 to 6 steps.

## 5. Page Core Content Suggestions

What should the page keep?
What should the page not include?

## 6. Necessary Images Or Interactions

Only include images or interactions that truly help understanding.
Explain what structure they help students see.
Do not include frontend implementation details.

## 7. Practice And Feedback

Design:
- basic practice;
- variation practice;
- transfer practice;
- common error feedback.

Practice should be randomizable when practical, and each random question family must remain focused on the corresponding knowledge point.

## 8. Final Student Understanding

Use one sentence to state what students should truly understand after learning.
```

Final requirement: Markdown must be mathematically accurate, concise, focused, and designed to make mathematics easier to learn rather than to generate more content.
