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

## DGOpenKS 3D Model Generation Standard

This is a project-level rule. Use it for all DGOpenKS 3D mathematical models unless the user explicitly changes the standard.

### Scope

This standard applies whenever a task involves:

- Three.js or WebGL 3D models;
- 3D mathematical visualization in HTML pages;
- solid geometry, volume, spatial decomposition, or spatial recomposition;
- 3D structure displays for formulas;
- rotatable, separable, highlightable, draggable, or otherwise interactive 3D models.

### Purpose

DGOpenKS 3D models are not decoration, technical showpieces, or ordinary animations. Their only purpose is to help users see mathematical structures that are otherwise hard to see.

When generating a 3D model, prioritize:

1. mathematical accuracy;
2. structural clarity;
3. controlled interaction;
4. comfortable visual design;
5. smooth performance;
6. genuine learning value.

If a 2D diagram, area model, or step-by-step animation explains the structure more clearly, do not force a 3D model.

### Before Implementation

Do not start writing 3D code immediately. Before implementing any 3D model, briefly state:

1. which mathematical topic or formula the model represents;
2. why 3D is needed instead of 2D;
3. what structure the model should help students see;
4. what students commonly misunderstand;
5. which geometric blocks compose the model;
6. what mathematical meaning each block represents.

If these points are not clear, do not proceed to implementation.

### Required Model Specification Table

Before implementation, write a model specification table:

```markdown
| Block ID | Mathematical Meaning | Geometry Size | Combined Position | Separated Position | Color Group | Label | Interaction |
|---|---|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... | ... | ... |
```

Requirements:

- Every 3D block must appear in the table.
- Every block must have a clear mathematical meaning.
- Every block's dimensions must match the mathematical structure.
- Every block's position must be determined by the mathematical structure, not arbitrary layout.
- Like mathematical terms must use identical or related colors.
- Labels must accurately show mathematical meaning.
- Interaction must support understanding rather than merely create motion.

### Mathematical Accuracy

Mathematical accuracy is more important than visual effect.

Every 3D block must strictly correspond to a term, a part of a formula, or a clearly explainable mathematical structure.

For difference expressions, never use negative length, width, or height. Negative quantities must be represented by removal, cutting away, difference regions, translucent subtraction regions, or highlighted removed parts.

### Interaction

3D interaction exists to support understanding, not free play.

Every 3D model should have clear states:

1. whole state;
2. separated state;
3. like-term focus state;
4. reset state.

Add other states only when useful, such as assembly, checking, error feedback, or completion.

If dragging is allowed, it must have preset directions, target slots, snapping rules, error rebound, and reset behavior. Do not allow users to drag the model into a mathematically broken state.

### Formula Linkage

3D models must not stand alone. They must be paired with formulas or structural explanations.

Requirements:

- The whole state shows the whole expression.
- The separated state shows the decomposed expression.
- When a block group is focused, the corresponding formula term is highlighted.
- When a formula term is selected, the corresponding 3D block group is highlighted.
- The formula explains the model, and the model explains the formula.

### Visual Design

3D models must be clear and comfortable.

Requirements:

- clean background;
- centered model;
- default camera angle shows length, width, and height;
- soft lighting;
- colors with mathematical meaning;
- consistent colors for like terms;
- clear labels that do not block the model;
- visible boundaries between blocks;
- no meaningless particles, glare, fast spinning, or complex transitions;
- animation only for decomposition, recomposition, highlighting, alignment, and structure explanation.

### Performance And Stability

3D models must run smoothly.

Implementation requirements:

- Generate geometry blocks from data.
- Do not hand-code large numbers of irregular meshes.
- Reuse geometry and materials where practical.
- Avoid heavy post-processing effects.
- Keep model count controlled.
- Use `requestAnimationFrame` appropriately.
- Update camera and renderer correctly on resize.
- Provide simplified or 2D fallback on low-performance mobile devices.
- Show fallback explanation when WebGL is unavailable.
- Do not sacrifice stability for visual effects.

Each mesh must store mathematical metadata, such as id, term, group, dimensions, and label.

### Page Integration

3D models must be embedded in the learning path:

```text
before model: expose the problem or misconception
during model: observe, separate, focus, interact
after model: summarize formula, practice transfer
```

Before users see the model, they must know what to observe, what to operate, and what to understand.

Do not begin a page with a complex 3D model before the learning question is clear.

### Prohibited

When generating 3D models, do not:

- sacrifice mathematical accuracy for visual spectacle;
- split geometry arbitrarily;
- use colors without mathematical meaning;
- use negative-size geometry;
- allow fully free dragging that breaks the structure;
- add meaningless particles, flashes, or fast rotation;
- create meshes without mathematical metadata;
- provide display-only animation without an observation or interaction task;
- let labels block the model;
- disconnect the model from the formula.

### Self-Check

After completing a 3D model, check:

1. Does every block have clear mathematical meaning?
2. Are all dimensions correct?
3. Can all blocks combine back into the whole?
4. Does the separated state reveal the formula source?
5. Are like-term colors and labels consistent?
6. Is interaction controlled?
7. Are formula and model linked?
8. Is the visual design clear, comfortable, and non-showy?
9. Is performance smooth?
10. Does the model make the mathematical structure easier to understand?

If any item fails, revise the model.

### Final Principle

DGOpenKS 3D models are not for demonstrating technology. They are for learning.

Final judgment:

> Does this 3D model make it easier for students to see, operate, and understand the mathematical structure?

If not, do not use 3D, or redesign the model.
