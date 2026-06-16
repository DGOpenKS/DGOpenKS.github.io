## Codex Skills Workflow

Global skills are stored in `~/.agents/skills/`.

Use:
- `$knowledge-essay-writer` for drafting DGOpenKS core teaching Markdown as knowledge-understanding essays.
- `$prose-style-editor` for polishing DGOpenKS Markdown prose without changing mathematical meaning.
- `$understanding-reviewer` for reviewing DGOpenKS Markdown understanding quality, tone, examples, and DGOpenKS fit before deriving pages or videos.
- `$html-prose-adapter` for adapting approved DGOpenKS Markdown understanding into learner-facing HTML/blog page prose. Use it for hero copy, subtitles, section transitions, visual prompts, formula lead-ins, example narration, practice instructions, CTA/button labels, and educational feedback microcopy. It must also preserve the visible core reading path, make the first-screen learning contract clear, align prose with nearby shown content, improve section-to-section continuity, and prevent the main explanation from becoming fragmented click-browsing. It must preserve mathematical meaning and must not invent new core explanations. If better page prose requires missing source understanding, report Markdown backflow instead of inventing it.
- `$design-reference-curator` before major DGOpenKS page redesigns to choose references and visual direction.
- `$ui-quality-reviewer` after DGOpenKS page implementation to review UI polish, learning clarity, interaction quality, motion restraint, and mobile readiness.
- `$formula-visualization` for formula-centered visual design, formula structure diagrams, algebraic transformation steps, formula cards, formula-to-image correspondence, and formula exercise feedback.
- `$math-visualization` for broader mathematical visual systems such as functions, coordinates, geometry, probability, and concept-level visual explanation.
- `$interaction-architect` for educational interaction systems such as draggable controls, parameter exploration, concept manipulation, and practice feedback flows.
- `$motion-design-system` for reusable motion rules and animation consistency across DGOpenKS pages.
- `$performance-optimizer` for rendering, animation, canvas, SVG, and interaction performance review.
- `$scrollytelling-engine` for scroll-driven educational narratives and sticky visualization plans.
- `$hyperframes` for video generation.
- `$content-to-video` for converting docs or articles into storyboard/video plans.
- `$blog-to-video` for turning blog posts into short video drafts without modifying the original blog.
- `$frontend-animation` for UI animation.
- `$gsap-motion` for GSAP timelines.
- `$framer-motion` for React animation.

## DGOpenKS Design Workflow

For major HTML/blog page creation or redesign:

1. Read the approved source Markdown. If no approved source Markdown exists, follow the no-approved-source branch below.
2. Produce an HTML Derivation Plan.
3. Check whether Markdown backflow is required.
4. If backflow is required, report the missing source explanation before implementation. Do not modify source Markdown unless the user explicitly authorizes it.
5. Choose the primary page type: Concept Blog Page, Formula Explainer Page, Interactive Visualization Page, Practice Lab Page, or 3D / Model Page.
6. Use `$html-prose-adapter` to adapt source understanding into page-level learner prose.
7. Produce an Interaction / Rendering Plan when the page includes major visualizations, practice blocks, animations, Canvas, SVG, WebGL, or 3D.
8. Use `$design-reference-curator` when visual direction matters.
9. Use relevant implementation skills as needed: `$formula-visualization`, `$interaction-architect`, `$math-visualization`, `$motion-design-system`, `$frontend-animation`, `$gsap-motion`, `$framer-motion`, `$performance-optimizer`.
10. Implement the page.
11. Self-check source fidelity, learning path, page prose quality, interaction quality, rendering quality, accessibility, responsiveness, performance, and practice feedback quality.
12. Use `$ui-quality-reviewer` after implementation.
13. Use `$performance-optimizer` when rendering is heavy or interactions may jank.
14. Only then ask the user to review in browser.

If no approved source Markdown exists:

- For final HTML/blog pages, stop after the provisional derived plan/spec and request source Markdown acceptance.
- If the user explicitly requests a prototype implementation despite missing source acceptance, the prototype must be clearly marked as provisional, non-final, and not source-faithful.
- Do not present a provisional prototype as an accepted learning page.

Rules:
- Do not rewrite existing source blog posts or approved Markdown unless explicitly asked.
- When implementing a derived HTML/blog page, adapting source understanding into page prose is allowed, as long as the mathematical meaning remains traceable to approved Markdown and no new core explanation is invented.
- Do not modify existing Markdown chapters when generating videos.
- Put generated video drafts in a separate directory.
- Prefer small, local changes.
- Before editing, identify the target file.
- After editing, summarize changed files.
- Derived interactive practice blocks should generate questions randomly or parametrically when practical, and each practice generator must stay focused on the corresponding knowledge point. Worked examples and misconception examples may remain fixed when fixed cases better reveal structure.
- Use `$formula-visualization` whenever the task centers on formula structure, symbolic transformation, formula cards, formula-to-diagram correspondence, or formula-based practice feedback.
- Use `$math-visualization` for broader mathematical visual design beyond formulas.
- Use `$interaction-architect` before designing substantial new educational interactions.
- Use `$html-prose-adapter` after HTML Derivation Plan and backflow check, before visual design and implementation. Do not wait until the page is finished to repair learner-facing page prose.
- For core teaching Markdown tasks, use the Markdown writing skills first. Visualization, interaction, motion, 3D, page layout, and video skills begin only after the Markdown has been accepted, unless the user explicitly asks for a derived spec or implementation.
- Skills may analyze any page.
- Skills may propose modifications.
- Skills are advisory unless the current task includes implementation. During implementation tasks, Codex may edit identified target implementation files. Do not silently modify source Markdown, mathematical derivations, unrelated interaction logic, or unrelated existing animations.

## DGOpenKS Core Teaching Markdown Standard

### Core Principle

DGOpenKS core teaching Markdown is the single source of mathematical understanding.

It is written for learners, not for teachers, page designers, video producers, or frontend implementers. Its task is to help a learner genuinely understand one mathematical idea by making the problem, object, observation, structure, formula, checks, and practice clear.

It is not:

- a page requirement document;
- an HTML specification;
- a teacher-facing lesson plan;
- a video script;
- an interaction specification;
- an animation note;
- a list of exercises;
- a compressed textbook chapter.

DGOpenKS 的 Markdown 是知识理解稿，不是页面需求文档。它只负责把知识讲透、讲活、讲出结构。HTML 和 Video 是从 Markdown 中派生出来的表现形式，不能反过来污染 Markdown 的写作。

### Required Workflow

Use this workflow unless the user explicitly changes the standard:

```text
Scope Check
-> Core Markdown Draft
-> Prose Editing
-> Understanding Review
-> Markdown Acceptance
-> Derived Specification Or Implementation
-> Backflow To Markdown When Needed
```

Markdown defines understanding. HTML turns that understanding into an interactive learning experience. Video turns that understanding into communication content. Derived work must not become a separate knowledge source.

### 0. Scope Check

Before writing the Markdown body, first determine:

- What single core learning question does this Markdown solve?
- What prior understanding may be assumed?
- What content must be excluded?
- What is the one understanding that should change after reading?
- Is the topic too broad and should it be split into smaller files such as 02-1, 02-2, or 02-3?

Consider splitting when any of the following appear:

- the draft explains more than one core formula or core structure;
- it handles both where a formula comes from and how to use it in reverse;
- it introduces both a new concept and a new method;
- it depends on multiple new prerequisite ideas;
- error-prone points come from different mathematical structures;
- the reader must switch between different understanding paths;
- practice naturally separates into different kinds of judgment tasks;
- the Markdown starts becoming a compressed chapter rather than one clear learning article.

The Scope Check may be internal, but its decision should control the Markdown.

### Writing Flow

Prefer this learner-facing order:

```text
problem -> object -> observation -> structure -> formula -> check -> practice
```

Do not begin by piling up formulas. Before a core formula first appears, the article should already provide:

1. a concrete object or problem;
2. an observation about that object;
3. a reason the formula is needed.

The formula should feel like it grows out of the object and observation, not like a rule pasted in from a textbook.

### Article Structure

The structure below is an internal writing order, not a required set of visible headings. Final Markdown headings should be learner-facing and should name the understanding problem being solved.

Do not expose stiff template headings such as `Concept Development`, `Learning Difficulties`, or `Key Examples` when a clearer learner-facing heading is possible.

Preferred external article shape:

```markdown
# Title

## 1. 先看懂这件事

State the core idea in learner-facing language.

## 2. 先从一个具体对象看起

Start from an object, expression, diagram, quantity relation, or concrete problem.

## 3. 这里最容易看错什么

When difficulty and error-prone points are the same structural issue, combine them here.
For each important error, explain what the wrong answer is, why it is tempting, what structure is missing, and how to check it.

## 4. 顺着结构推出公式或概念

Move from object to observation to structure to formula or concept.

## 5. 用例子检查理解

Use examples to show judgment and reasoning, not just procedures.

## 6. 换几个练习再判断

Include focused practice families when useful. Practice may be merged into the example section if that reads more naturally.

## 7. 以后会在哪里用到

Briefly connect to later knowledge without expanding into a new lesson.

## 8. 最后真正要记住的是

End with one sentence about the understanding the learner should carry away.
```

### Template Instruction Boundary

The preferred article shape above is a writing guide for Codex, not text to copy into the final article.

English instructions inside templates are for Codex only and must not appear in final learner-facing Markdown. Final Markdown should be written in the user-requested language, usually Chinese.

Do not include meta statements such as "This document is DGOpenKS core teaching Markdown" in the final learner-facing article unless the user explicitly asks for that metadata.

If two sections repeat the same content, merge them. Do not preserve sections merely to satisfy a template.

### Error Explanation

Error-prone points must not be just warnings or lists of wrong answers. Each core error should make the structure clearer.

Use this pattern when helpful:

```text
错误表现:
为什么容易这样错:
真正的结构:
检查方法:
```

Avoid writing only "注意不要..." without explaining the structure.

### Concept Development

For each core formula or concept, explain:

- what problem it solves;
- what object it corresponds to;
- why it is true;
- when it can be used;
- when it cannot be used;
- how it differs from the error-prone forms nearby.

Concept explanations must land on mathematical structure, not only on intuition, metaphor, or memory tricks.

### Formula And Structure Article Refinement Rules

For formula-centered or algebraic-structure Markdown, begin from a concrete conflict, common mistake, or judgment problem whenever possible, rather than an abstract announcement of the topic.

The opening scope must match the full article. If a formula, variant, reverse use, or object is introduced later, it should either appear in the initial scope or be clearly marked as a secondary extension.

Formula classification should support learner judgment. Prefer short comparison tables or compact blocks that answer:

- what form is being seen;
- what should be checked first;
- whether the next action is expansion, factorization, transformation, or rejection of the formula.

When deriving formulas, prefer showing how the formula is discovered from structure, not only verifying it after it is stated. Verification by multiplying back is useful, but important formulas should also explain how the unknown part is determined. For example, set an unknown middle coefficient, require cancellation or matching, and then solve for that coefficient.

Avoid repeated derivations. A formula's source should be fully developed once. Later appearances should summarize, compare, apply, or check the formula instead of repeating the same explanation.

State mathematical scope carefully. When a claim depends on the current learning range, such as integer, rational, or polynomial factorization, say so explicitly. Avoid globally false shortcuts such as saying a number is "not a cube" when it is only not a usable complete cube in the current range.

Use Markdown math syntax for core formulas and derivation equations, such as inline `$...$` or block `$$...$$`. Use code blocks mainly for structure tables, question families, judgment prompts, or plain-text comparison patterns.

If a variant formula is introduced, include at least one example or practice family for it. Do not introduce a sign variant, transformed object, reverse-use formula, or look-alike structure without giving the learner a chance to check that structure.

Visualization notes inside final learner-facing Markdown must be learner-facing. Avoid authoring notes such as "this section should use a diagram." Prefer prose such as "if this is shown with a diagram, you should notice..." or "the diagram helps reveal..." If a note is only for later HTML, visualization, or interaction design, keep it clearly separated as an authoring note and do not mix it into the learner-facing article.

When an article repeatedly asks the learner to "judge the structure first," provide a final executable judgment method, such as a table or checklist. The learner should know what to ask before applying the formula.

For multi-formula articles, control cognitive load by making each formula's role explicit: which one expands, which one factors, which one checks structure, and which look-alike forms cannot use the formula directly.

### Examples And Practice

Examples should reveal structure, train judgment, or prevent a specific misunderstanding. They should not merely demonstrate procedures.

Practice must serve the current understanding goal. It should train structure recognition before calculation.

When practical, practice should include:

- a direct case that fits the structure;
- a look-alike case that does not fit;
- a case that requires a small transformation before judging.

Randomizable practice may be described in Markdown only as teaching rules, question families, judgment methods, and answer checks. Do not write generator code, UI behavior, buttons, or implementation details.

### Practice Layer Boundary

In core Markdown, randomizable practice belongs at the level of question families, structure checks, answer checks, and feedback intentions.

Actual random generators, UI behavior, buttons, feedback states, and implementation logic belong only to derived interaction or implementation tasks.

### Visualization Boundary

Markdown may describe the teaching intention of an image or visualization, such as:

```text
这里适合用面积图帮助看见两个 ab 的来源。
```

Markdown must not describe implementation details such as HTML, CSS, JavaScript, Three.js, GSAP, button behavior, layout, animation timing, or 3D model specification tables.

Visualization teaching intentions in core Markdown should be brief and conceptual. Prefer learner-facing phrasing when the note is part of the article. If the note is for derived implementation, keep it clearly separated as an authoring note and do not include HTML/CSS/JS, layout, animation, interaction, or rendering details.

### Language Style

Write to the learner directly.

Avoid teacher-facing or design-document language, such as:

- "帮助学生...";
- "学生应该...";
- "本节训练...";
- "教师可以引导...";
- "页面应该...";
- "按钮点击后...".

Prefer learner-facing language, such as:

- "先不要急着背公式...";
- "这里真正要分清的是...";
- "你可以这样看...";
- "检查时先问自己...".

The prose should be natural, concise, and clear, but not casual or empty. It must remain mathematically precise.

### Forbidden Content

Core Markdown must not include:

- HTML, CSS, or JavaScript;
- Three.js, GSAP, Framer Motion, or other implementation details;
- buttons, cards, page layout, or UI component descriptions;
- animation implementation;
- video shots, narration, subtitles, transitions, or background music;
- frontend interaction implementation;
- 3D model specification tables;
- generated page copy dumps.

Formula visualization, interaction design, page layout, 3D model requirements, motion design, and video details belong to derived specs or implementation tasks, not the core Markdown.

The 3D model standard below must not be applied to core Markdown writing. It applies only after the knowledge understanding is clear and the task explicitly enters derived visualization or HTML implementation.

### Skill Workflow

Use the writing skills in this order when drafting or rewriting DGOpenKS core Markdown:

1. `$knowledge-essay-writer` drafts the knowledge-understanding article. It is responsible for scope, core question, concrete object, understanding path, and making formulas grow from objects.
2. `$prose-style-editor` polishes the prose. It removes teacher-facing language, merges repetitive sections, shortens unclear passages, preserves mathematical structure, and keeps the article readable for learners.
3. `$understanding-reviewer` reviews the article. It must judge whether the learner can genuinely understand the idea, not merely whether the format is present.

`$prose-style-editor` must not delete mathematical structure for smoother language. `$understanding-reviewer` must check learning clarity, not only headings.

### Markdown Acceptance Checklist

Before a Markdown is accepted as a core knowledge source, it must satisfy:

1. The core learning question is single and clear.
2. The opening states what understanding should change.
3. The core formula or concept grows from an object, observation, and structure.
4. Error-prone points explain structural causes, not just wrong answers.
5. Examples show judgment and reasoning, not just procedure.
6. Practice trains structure recognition before calculation.
7. Randomizable practice is described as question families and checks, not implementation.
8. The language is learner-facing, not teacher-facing.
9. The Markdown contains no HTML, CSS, JS, UI, animation, video, or 3D implementation details.
10. Visualization notes, if present, are teaching intentions only.
11. The article does not over-expand into a later lesson.
12. The ending returns to the final understanding.
13. For formula or structure articles, the opening scope matches all formulas, variants, and reverse uses introduced later.
14. Important formulas are derived from structure, not only verified after being stated.
15. If the article requires structure judgment, it gives an executable judgment table, checklist, or decision method.
16. Core formulas and derivation equations use Markdown math syntax unless a code block is intentionally used for a plain-text structure pattern.

Additional review question:

```text
If all formulas were removed, could a learner still roughly explain what problem this knowledge solves?
```

If the answer is no, the article is still too formula-driven and must be revised.

### Common Failure Types

Reject or revise Markdown that falls into these patterns:

- Textbook compression: definition, formula, example, exercise, with no understanding path.
- Teacher lesson-plan voice: "help students master..." instead of explaining to the learner.
- Page requirement writing: buttons, cards, animation, interaction, layout, or implementation.
- Formula pile-up: formulas appear before object, observation, and structure.
- Scope mismatch: the opening promises one object, but later introduces extra formulas, variants, or reverse uses without framing them.
- Verification-only derivation: a formula is stated and checked, but the article does not explain how its missing part or structure is found.
- Judgment without method: the article repeatedly says "judge the structure first" but gives no executable judgment table, checklist, or decision path.
- Error list only: wrong answers are listed without structural causes or checks.
- Exercise pile-up: many questions appear without training judgment.
- Unsupported variant: a sign variant, transformed object, or reverse-use formula appears without an example or focused practice.
- Over-expansion: too many later ideas are packed into one Markdown.
- Empty metaphor: vivid language appears without mathematical structure.

### Derivative Backflow Rule

Core Markdown is the single knowledge source.

Derived HTML, interaction, visualization, 3D, motion, and video may change presentation, but they must not invent, change, or silently add core mathematical explanations.

If derived work reveals that the Markdown lacks an explanation, example, correction, formula clarification, misconception category, or conceptual bridge, report the missing source explanation first.

Do not modify source Markdown unless the user explicitly authorizes it. If authorized, revise the Markdown, pass the Markdown Acceptance Checklist, and then update the derived work.

If the user does not authorize source Markdown changes, implement only source-supported parts and do not invent missing knowledge in HTML, interaction, visualization, 3D, motion, or video.

### Derived Task Conflict Rule

If the current task is only to generate a video, page, visualization, or other derived output, do not silently modify existing core Markdown.

If derived work reveals that the Markdown needs a correction or added explanation, report the required Markdown backflow first. Revise the source Markdown only when the user explicitly authorizes that edit.

If no approved Markdown exists and the user explicitly requests derived work anyway, produce only a provisional derived plan/spec and clearly mark that source acceptance is missing. Do not present provisional derived work as a final source-faithful page.

Do not rewrite existing chapter Markdown merely because this rule changed unless the user explicitly asks for that rewrite.

## HTML / Blog Learning Experience Standard

### Core Principle

HTML does not merely display Markdown. HTML reorganizes approved Markdown understanding into a guided, readable, interactive learning path.

A successful HTML/blog page is not a prettier version of Markdown. It is a source-faithful learning journey derived from Markdown.

Final HTML/blog pages should derive from approved Markdown. If no approved Markdown exists and the user explicitly requests derived work, produce only a provisional derived plan/spec and clearly mark that source acceptance is missing.

HTML/blog pages should generally organize learning as:

```text
problem -> observation -> explanation -> formula -> example -> practice -> transfer
```

This is a learning-path requirement, not a fixed visual layout template.

### HTML Derivation Plan

Before creating or redesigning a major HTML/blog page, produce a lightweight HTML Derivation Plan.

The plan must include:

- source Markdown file or section;
- target learner outcome;
- core question, confusion, or misconception;
- primary page type and secondary modules when any;
- mapping from Markdown ideas to page sections;
- required visualizations or interactions;
- required practice behavior;
- whether Markdown backflow is needed.

Use this shape when helpful:

```text
HTML Derivation Plan

Source:
- Markdown file:
- Relevant sections:

Learning goal:
- After this page, the learner should be able to...

Opening question:
- The page begins by asking...

Primary page type:
- Concept Blog Page / Formula Explainer Page / Interactive Visualization Page / Practice Lab Page / 3D Model Page

Secondary modules:
- Visualization / Practice / Formula Explanation / 3D / Motion / Other

Section mapping:
- First screen -> derived from Markdown section X
- Visual intuition -> derived from Markdown section Y
- Formula explanation -> derived from Markdown section Z
- Worked example -> derived from Markdown section A
- Practice interaction -> derived from Markdown practice intent B

Backflow required:
- Yes / No
- If yes, explain what is missing from Markdown.
```

If the HTML implementation requires a missing explanation, new conceptual claim, new mathematical relationship, or changed reasoning path, do not invent it in HTML. Report the missing source explanation and request Markdown backflow.

### Page Types

Choose a primary page type before implementation:

- Concept Blog Page;
- Formula Explainer Page;
- Interactive Visualization Page;
- Practice Lab Page;
- 3D / Model Page.

Secondary modules such as visualization, practice, formula explanation, or 3D may appear inside the page. The primary page type controls the main learning path; secondary modules obey their own standards.

Minimum requirements:

- Concept Blog Page: problem-first opening, continuous prose spine, concrete example, relevant rule or formula explanation, and a check-for-understanding block.
- Formula Explainer Page: motivation for the formula, symbol explanation, visual/verbal/structural derivation, worked application example, misuse warning, and practice check.
- Interactive Visualization Page: prediction prompt, limited meaningful controls, visible mathematical relationship, post-interaction explanation, and transfer question.
- Practice Lab Page: clear target skill, randomized, parameterized, or deliberately curated fixed tasks when fixed cases better reveal the structure, misconception-aware feedback, progressive difficulty when useful, and a summary of practiced ideas.
- 3D / Model Page: follow the 3D standard, embed the model inside the same problem -> observation -> explanation -> transfer path, and do not let the 3D model replace the prose explanation.

### Learning Path

A standard HTML/blog learning page should:

1. Start with a concrete question, confusion, or observable situation.
2. Let the learner notice a pattern before naming the rule.
3. Introduce informal explanation before formal formula when possible.
4. Present formulas as summaries of observed structure.
5. Apply the idea in at least one worked example.
6. Include a focused check, practice task, or interaction when useful.
7. End with transfer, reflection, or a summary of when to use the idea.

The first screen must create a learning need. It should include a concrete question, conflict, or misconception; a short promise of what the learner will understand; and optionally a small example, visual, or interactive preview.

The first screen must not be a dense formula dump, decorative animation alone, or a static textbook heading unless the learning purpose requires it.

For beginner-facing pages, the first screen must not assume the learner already knows the formula, symbol, special term, or surprising term that the page is meant to explain. Introduce the concrete object first, then the observation, then the formula or named structure.

Example:

- Weak: ask "2ab 从哪里来?" before the learner has seen why two `ab` areas exist.
- Better: start from a square whose side is split into `a` and `b`, show the four area pieces, then name the two `ab` pieces as `2ab`.

When a later section depends on a distinction such as "worked examples" versus "self practice", the section titles must make the different learning jobs visible. Do not give adjacent sections near-identical headings such as two versions of "先判断结构".

### Blog Prose Spine

Every learning page must have a readable prose or instructional spine.

Concept and formula pages should have continuous blog-like prose. Cards, panels, tabs, accordions, and callouts may support the article, but they must not replace the article. The page should remain understandable as a continuous reading experience even if layout containers are removed.

Practice labs and tools may use shorter instructional prose, but they must still explain what to do, what to observe, how feedback connects to the concept, and what to take away.

Rules:

- Use paragraphs to carry reasoning.
- Use headings to mark conceptual turns, not only UI sections.
- Introduce each visual or interaction before showing it.
- Interpret each visual or interaction after the learner uses it.
- Avoid disconnected UI cards with fragmentary text.
- Avoid dashboard-like layouts unless the page is explicitly a tool or lab.

A blog page must not become a dashboard of disconnected widgets.

## HTML Page Prose Standard

HTML page prose is derivative learner-facing prose.

It adapts approved Markdown understanding into readable page narration, but must not invent new mathematical understanding.

Simple does not mean flat. Concise does not mean empty. Page prose must create learning momentum.

The goal is not marketing copy. The goal is clear, concrete, mathematically precise prose that makes the learner want to keep reading, observing, trying, and checking.

`$html-prose-adapter` belongs to the HTML/blog derivative layer. It may adapt approved Markdown understanding into page-level learner prose. It may not modify source Markdown unless the user explicitly authorizes Markdown backflow. It may not invent new mathematical explanations, formulas, misconception categories, or reasoning paths.

## HTML Text Flow Standard

HTML text must support continuous reading.

This is a derivative-layer rule for HTML/blog page text only. It does not change the Core Markdown Standard and does not add mathematical rendering, visualization, animation, or interaction implementation requirements.

Core explanation should be read, not hunted. The first screen should make the learning contract clear. What the prose says, the page should immediately show.

### Core Path Visible By Default

The main conceptual explanation must be visible by default.

A learner should be able to understand the page's core idea by reading the visible page flow from top to bottom. The learner should not have to click through scattered cards, tabs, accordions, or panels to reconstruct the core explanation.

Do not hide the main learning path behind:

- tabs;
- accordions;
- click-to-reveal cards;
- carousels;
- scattered panels;
- disconnected content blocks.

Clickable or collapsible content may be used for:

- optional details;
- additional examples;
- hints;
- answer reveal;
- practice variants;
- side comparisons;
- deeper explanation.

Clicks must not be required to understand the core idea.

### First-Screen Learning Contract

The title and first paragraph must make the page's learning contract clear.

After reading the title and first paragraph, the learner should know:

- what object the page studies;
- what confusion, contrast, or judgment problem the page solves;
- what method the page will use;
- what the learner will be able to decide, explain, expand, factor, compute, compare, or check.

The first screen fails if the title sounds attractive but the learner still cannot tell what the chapter is about after reading the first paragraph.

Good first-screen copy should answer:

- What are we looking at?
- Why is it easy to get wrong?
- What will this page help me distinguish?
- What should I be able to do after reading?

### Say -> Show Alignment

HTML page text should follow Say -> Show alignment.

When prose names an object, expression, formula, example, contrast, or judgment task, the corresponding content should appear immediately nearby.

Use this pattern:

```text
Say:
Tell the learner what to look at or judge.

Show:
Immediately display the corresponding expression, formula, example, option, or text block.

Interpret:
Explain what the shown object means and why it matters.
```

Do not mention an important object and make the learner click elsewhere to find it. Do not describe a comparison while the compared objects are hidden. Do not introduce a judgment task before the learner can see the object being judged.

This adapts the video principle "speak what, then show what" into HTML text: what the text says, the page should immediately show in the reading flow.

### Avoid Fragmented Browsing

Cards, panels, tabs, and callouts may organize content, but they must not break the reasoning chain.

If content is split into cards, the split must make the sequence clearer. Each card should still belong to a visible reading order, and the page should make clear why the content is grouped that way.

The page fails if the learner must browse around the interface to assemble the main explanation.

### Section Re-Orientation

Each major section should begin with a short orientation sentence.

It should answer:

- Where are we in the learning path?
- What are we judging or explaining now?
- How does this connect to the previous section?

Avoid adjacent sections with similar headings or unclear roles. Worked examples and self practice must have visibly different learning jobs.

### HTML Prose Adapter Responsibilities

`$html-prose-adapter` should not only polish sentences. It should ensure that the order of visible page text matches the learner's understanding path.

Expand `$html-prose-adapter` responsibilities to include:

- preserving the visible core reading path;
- making the first-screen learning contract clear;
- applying Say -> Show alignment;
- improving section-to-section continuity;
- preventing the main explanation from becoming fragmented click-browsing.

### Hero Copy

The first screen should not only summarize the topic. It should create a reason to continue.

Good hero copy usually includes:

- a common mistake, surprise, or judgment problem;
- a concrete object, expression, diagram, or situation;
- a short promise of what the learner will see or understand;
- an action-oriented next step.

Avoid learner-flat openings such as:

- "本页介绍...";
- "本节学习...";
- "这一页只解决...";
- "我们将掌握...";
- "下面我们来...".

Prefer openings such as:

- "看到 ___，先判断 ___.";
- "真正要分清的是 ___.";
- "你会发现，___ 不是靠背，而是从 ___ 推出的.";
- "如果 ___，说明你可能漏看了 ___.";
- "先判断：___ ?".

### Page Copy Voice

Learner-facing page copy must not sound like a design plan, lesson scope note, or internal requirement.

Do not expose implementation or planning language to learners.

Avoid:

- "这一页只解决一个判断";
- "本模块用于训练...";
- "该区域展示...";
- "用户点击按钮后...";
- "页面应该帮助学生...".

Prefer:

- "先判断结构。";
- "当前只关注一件事。";
- "拖动时重点观察哪一块没有变。";
- "如果图里找不到这一项，说明展开时可能漏了一块。".

### Visible Text Jobs

Every visible text block must serve at least one learning job:

- hook: make the learner want to continue;
- orient: tell the learner what they are looking at;
- observe: tell the learner what to notice;
- interpret: explain what just changed or appeared;
- connect: link diagram, formula, example, and practice;
- act: tell the learner what to do next;
- reflect: help the learner summarize the judgment method.

Avoid empty copy such as:

- "这是一个重要知识点。";
- "请认真观察。";
- "下面我们来学习。";
- "这是公式展示区。".

### CTA And Button Labels

Button and CTA labels should describe the learner action, not generic UI movement.

Weak labels:

- "开始";
- "下一步";
- "先看图";
- "直接练习";
- "查看更多";
- "提交".

Better labels:

- "观察正方形怎样分块";
- "拆开这块面积";
- "判断这是不是完全平方";
- "更换题目再判断";
- "检查是否漏项";
- "对应图形与公式";
- "练习结构判断".

A CTA label should answer:

```text
What learning action will the learner take after clicking?
```

### Headings

Section headings should mark conceptual turns, not only UI sections.

Weak headings:

- "公式展示";
- "例题讲解";
- "互动练习";
- "知识总结";
- "可视化区域".

Better headings:

- "先从边长为 a+b 的正方形开始";
- "哪种式子像一整块正方形?";
- "什么时候不能用完全平方?";
- "先判断结构，再展开或分解";
- "看四个例子，分清三种结构";
- "自己判断结构，再展开或分解";
- "图里找不到的一项，公式里也不能乱写".

Headings should advance the article rather than label components.

Adjacent headings must also show the role of each section in the learning sequence. A worked-example section and a practice section should not both use almost the same heading. Prefer distinctions such as:

- Example section: "看四个例子，分清三种结构";
- Practice section: "自己判断结构，再展开或分解".

### Formula Card Framing

Formula cards may appear in the first screen only when they are framed as objects to compare, questions to resolve, or structures to be explained.

They must not appear as unexplained authority.

On beginner-facing pages, if formulas depend on a visual or concrete object that has not yet been introduced, do not put the formulas in the first viewport. Put the concrete objects there instead, then introduce formulas after the learner has seen the object and observation.

Weak framing:

```text
公式:
(a+b)^2 = a^2 + 2ab + b^2
```

Better framing:

```text
先建立三个面积对象:
边长为 a+b 的正方形;
边长为 a-b 的正方形;
大正方形减去小正方形。
```

### Visual And Interaction Prompts

Before a visual or interaction, page prose must tell the learner what to observe. After the visual or interaction, page prose must interpret what changed and why it matters.

Weak prompts:

- "拖动滑块看看变化。";
- "观察下面的图。".

Better prompts:

- "拖动时重点观察中间两块。";
- "数字在变，但这两块始终来自同一个动作：a 和 b 相乘。";
- "两块 ab 合在一起，展开后写成 2ab。".

### Practice And Feedback Microcopy

Practice copy should tell the learner what judgment to make, not only what answer to enter.

Weak practice copy:

- "请选择正确答案。";
- "完成下面的练习。".

Better practice copy:

- "先判断结构，再展开或分解。判断它属于哪种面积结构：完整正方形、需要补回角落的正方形，还是两个正方形相减。";
- "如果你选了完全平方，请先确认：中间项是不是两个相同乘积合起来的 2ab。".

Practice feedback should be concise but explanatory. It should not only say correct or incorrect.

Weak feedback:

```text
错误，请重试。
```

Better feedback:

```text
你把它看成了完全平方，但中间项对不上。
完全平方的中间项必须能看成 2ab。
这里缺的不是计算，而是结构判断。
```

### Tone

Page prose must not use fake excitement, marketing slogans, or empty hype.

Avoid:

- "超简单!";
- "一秒掌握!";
- "神奇公式来了!";
- "再也不会错!";
- "爆炸式理解!".

Preferred tone:

- clear;
- concrete;
- learner-facing;
- mathematically precise;
- inviting enough to continue reading;
- not hype;
- not teacher-facing;
- not implementation-facing.

### Register And Tone Control

HTML page prose should use modern written explanatory Chinese.

It should be:

- learner-facing;
- clear;
- concrete;
- concise;
- mathematically precise;
- inviting to continue;
- but not casual, chatty, childish, or speech-like.

Learner-facing does not mean conversational slang.
Natural does not mean oral.
Engaging does not mean informal.

Avoid overly colloquial or spoken phrases such as:

- 待会儿;
- 等下;
- 先盯住;
- 咱们;
- 搞懂;
- 搞定;
- 看一下;
- 来看一眼;
- 你看哈;
- 很神奇;
- 答案就会露出来;
- 这就对了;
- 超简单;
- 别慌;
- 一眼看穿.

Also avoid stiff translated or unnatural word order such as:

- 暂不展开，先判断结构;
- 进行展开;
- 每道题都进行同一个判断;
- 它对应一整块正方形;
- 当前重点不是计算结果;
- 答案会变得清楚.

Prefer precise written teaching verbs such as:

- 接下来;
- 暂时;
- 先观察;
- 重点观察;
- 比较;
- 判断;
- 对应;
- 检查;
- 说明;
- 推出;
- 发现;
- 区分;
- 确认;
- 回到图形;
- 回到结构.

Prefer natural written Chinese word order:

- 先判断结构，再展开;
- 先判断结构，再展开或分解;
- 做题时，第一步是判断结构;
- 选择结构后，再写展开或分解结果;
- 结构判断正确，公式才有使用条件.

The tone should feel like a clear learning article, not like a spoken lecture transcript, not like a short-video script, and not like marketing copy.

Final principle:

```text
A page can be mathematically correct and still fail as a learning page if the prose does not make the learner want to continue.

HTML page prose should feel like someone is guiding the learner to notice, judge, and explain, not like a requirements document, not like a textbook summary, and not like marketing copy.
```

### Visualizations, Formulas, Examples, And Practice

Every visualization must have a before/during/after teaching structure:

- Before: tell the learner what to look for and ask a prediction question when useful.
- During: let the learner inspect or manipulate meaningful mathematical structure, preferably one main variable at a time.
- After: state what changed, what stayed invariant when relevant, what relationship, condition, trend, or structure became visible, and how the observation connects back to the Markdown concept or formula.

In HTML/blog pages, formulas should usually appear as summaries of an observed structure, not as unexplained starting points. Formula blocks must explain, as applicable, the relationship, transformation, invariant, condition, or quantity captured by the formula; what each symbol means; how the formula connects to a concrete example; and the plain-language meaning of the formula.

For formula-centered pages, core formulas should normally be paired with 2D or 3D rendered structures and, when useful, interaction. The learner should be able to see the formula's terms, coefficients, signs, cancellation, decomposition, recomposition, or parameter relationships in the rendered object, not only read them in text.

Worked examples must be part of the explanation, not only an appendix after theory. A good example starts from a learner-facing question, shows the reasoning path, identifies the key decision, connects back to the concept just introduced, and avoids introducing new theory not present in Markdown.

HTML may instantiate concrete examples from approved Markdown structures or practice families. Markdown backflow is required only when an example introduces a new explanation, new reasoning path, new misconception category, new formula clarification, or missing conceptual bridge.

Practice interactions must test the knowledge point currently being taught. They should include a target concept, randomized or parameterized generation when appropriate, clear input or interaction, immediate feedback, misconception-aware explanation, and retry or new-example behavior.

Randomization applies mainly to derived interactive practice blocks. Worked examples and misconception examples may remain fixed when fixed cases better reveal structure. Core Markdown describes question families, checks, and feedback intent only.

### HTML / Blog Pass And Fail Gate

An HTML/blog page passes only if:

- core explanations are traceable to approved Markdown;
- the page has a visible learning path;
- the page has a readable prose or instructional spine appropriate to its page type;
- visuals and interactions serve understanding;
- formulas are motivated and explained;
- core computational formulas on formula-centered pages have corresponding 2D or 3D visual or interactive representations whenever practical;
- examples show reasoning, not only answers;
- practice tests the current concept and gives useful feedback;
- beginner-facing pages introduce object and observation before naming formulas, symbols, or surprising terms;
- adjacent sections have distinct learning jobs, especially worked examples versus self practice;
- Chinese page prose uses natural written word order, not oral slang or stiff translated phrasing;
- the page is responsive, accessible, and readable;
- motion and visual polish do not compete with learning.

An HTML/blog page fails if:

- it introduces new mathematical claims not present in Markdown;
- it silently changes the Markdown explanation;
- it starts with an unmotivated formula dump;
- a core computational formula remains only a text formula when its structure can reasonably be shown through 2D or 3D rendering;
- it assumes a beginner already knows the formula, symbol, or term that the page is supposed to explain;
- it is mostly disconnected cards/widgets with no prose or instructional spine;
- it uses animation, 3D, or interaction as decoration;
- it shows visualizations without observation guidance;
- it gives feedback that only says correct or incorrect;
- it includes exercises unrelated to the current concept;
- it hides missing source explanation by inventing page copy;
- it looks polished but does not make the concept easier to understand.

An HTML/blog page also fails if:

- the hero copy merely announces the topic without creating learning need;
- the title and first paragraph do not make the chapter topic and learning task clear;
- the learner must click through multiple content fragments to understand the main explanation;
- the page says something but does not immediately show the corresponding object, expression, formula, example, contrast, or judgment task;
- core explanation is scattered across tabs, cards, accordions, carousels, or panels without a visible reading sequence;
- section headings or openings do not clarify where the learner is in the learning path;
- visible text sounds like a design plan, scope note, or teacher instruction;
- visible text sounds like spoken classroom banter, short-video copy, or stiff translated Chinese;
- headings are only component labels and do not mark conceptual turns;
- adjacent headings repeat the same learning job and make worked examples look like practice;
- worked examples and practice blocks look like the same kind of content;
- CTA labels are generic UI actions instead of learning actions;
- formula cards appear as unexplained authority;
- visualizations are shown without specific observation prompts;
- practice instructions tell the learner what to click but not what to judge;
- feedback copy is correct/incorrect only;
- the prose is simple but flat, empty, or uninviting;
- the prose uses fake excitement instead of concrete mathematical clarity.

Looks polished but does not teach better = fail.

## Interaction Quality Standard

Interactions are derivative teaching instruments. They must help the learner observe, test, correct, or apply a concept from approved Markdown.

Clickable UI is not automatically meaningful interaction. Animated UI is not automatically meaningful explanation.

### Learning Purpose And Loop

Every major interaction must identify:

- target concept;
- learner action;
- visible state change;
- expected observation;
- feedback behavior;
- retry or completion behavior.

Effective interaction forms a learning loop:

```text
action -> visible change -> interpretation -> feedback -> next action
```

Before the interaction, tell the learner what to try and what to observe. During the interaction, respond immediately, keep state visible, expose meaningful mathematical variables, and avoid irrelevant controls. After the interaction, interpret what changed, identify what stayed invariant, connect the result back to the source concept, and offer feedback, retry, or transfer.

Core judgment:

```text
What mathematical structure does this action help the learner see?
```

If this cannot be answered, the interaction should not be a major page interaction.

### State, Feedback, And Controls

Interactive state must be visible, reversible, and understandable.

The learner should know:

- what is selected;
- what value is being changed;
- whether an answer is pending, correct, incorrect, or incomplete;
- how to reset, retry, or continue.

Old feedback must not persist after a new problem state unless intentionally preserved.

Practice feedback must explain reasoning, not only correctness. It should identify what was correct, what went wrong, which concept applies, and how to revise the answer.

Controls must expose meaningful mathematical variables only. Avoid controls that change irrelevant visual details, too many variables at once, invalid states without explanation, or UI that makes the learner debug the interface instead of the concept.

Prefer one primary variable per interaction unless comparison between variables is the learning goal.

### Randomized Practice Generator Quality

Randomization applies mainly to derived interactive practice blocks. Worked examples and misconception examples may remain fixed when fixed cases better reveal structure.

Randomized practice must be generated from a valid conceptual model.

Each generator must define:

- target concept;
- valid input range;
- correct answer computation;
- common wrong-answer patterns;
- feedback mapping;
- retry behavior;
- difficulty progression when useful.

A randomized exercise fails if it can generate mathematically invalid, ambiguous, impossible, or out-of-scope cases.

Avoid no-solution cases unless intentionally taught, multiple valid answers when only one is accepted, non-integer answers when the UI expects integers, generated tasks beyond the current Markdown knowledge point, and visual display inconsistent with answer logic.

### Accessibility And Failure Conditions

Interactive components must support mouse, touch, keyboard when applicable, visible focus states, non-color-only feedback, readable labels, and reduced-motion alternatives when motion is used.

Do not make essential explanations available only through hover.

An interaction fails if:

- it has no clear learning purpose;
- it changes visuals without improving understanding;
- the learner does not know what to observe;
- states are hidden, delayed, or confusing;
- feedback only says correct or incorrect;
- controls expose irrelevant variables;
- invalid inputs are not handled;
- randomized tasks can generate broken cases;
- the interaction only works with mouse hover;
- the interaction distracts from the concept.

## Rendering Quality Standard

Rendering quality means that the browser experience is accurate, stable, readable, responsive, accessible, and performant.

A page does not pass because it looks polished. It passes only if the rendered experience preserves and clarifies the source understanding.

### Mathematical Rendering Accuracy

Rendered diagrams, graphs, models, and formula visuals must accurately represent the mathematical idea. The rendered visual must not distort, exaggerate, or simplify the concept in a misleading way.

Whenever possible, visual state, formula state, and answer-checking state should share the same internal data model.

### Mathematical Diagram Precision Standard

Mathematical diagrams must be generated from explicit mathematical models, not by visually placing points until they look right.

For coordinate systems, function graphs, analytic geometry, plane geometry, or solid geometry:

- define the mathematical object first: function, point, line, circle, polygon, vector, plane, solid, transformation, or relation;
- define a world-coordinate system and a deterministic mapping from mathematical coordinates to SVG, Canvas, or WebGL coordinates;
- compute all labeled points, intersections, roots, vertices, midpoints, tangent points, perpendicular feet, areas, and lengths from the model;
- generate curves by sampling the function or using a mathematically justified path, not by hand-drawn Bezier curves that only approximate the intended shape visually;
- bind labels to mathematical objects with stable offsets, so labels do not imply a different point, line, axis, or region;
- keep visual encodings consistent: axes, grids, function curves, construction lines, roots, vertices, intersections, and highlighted regions must have stable roles;
- avoid decorative distortions, arbitrary point placement, misleading curvature, inaccurate proportions, or labels that cover the object they explain.

For function graphs:

- roots must lie on both the graph and the x-axis;
- y-intercepts must lie on both the graph and the y-axis;
- intersections must satisfy both functions;
- vertices must lie on the graph and on the symmetry axis when applicable;
- tangent points must lie on both the curve and the tangent line;
- area rectangles must have vertices determined by axes and points on the graph;
- asymptotes, excluded values, and undefined points must be shown only when mathematically correct for the visible domain.

For plane geometry:

- midpoints must be computed as averages;
- perpendicular and parallel markings must match actual slopes, vectors, or angle calculations;
- equal-length marks must correspond to equal computed distances;
- angle marks must correspond to actual angle values or proven equal angles;
- circles, arcs, and tangent lines must use computed centers, radii, and tangent points.

For 3D or solid geometry:

- vertices, edges, faces, dimensions, cross-sections, and projections must be model-defined;
- camera perspective may clarify depth, but must not change mathematical relationships;
- labels must refer to actual vertices, edges, faces, dimensions, or computed derived objects.

Manual SVG coordinates are allowed only for layout containers, decorative separators, and non-mathematical framing. They are not allowed for mathematically meaningful points, curves, intersections, or geometric relationships unless those coordinates are the output of a documented model.

Before accepting a mathematical diagram, self-check at least the relevant invariants:

- Does every highlighted point satisfy the equation, construction, or relation it claims to show?
- Do intersections satisfy all objects involved?
- Do roots have y=0 in world coordinates?
- Does the vertex match the formula or construction?
- Do labels point to the correct mathematical object?
- Does the rendered diagram still preserve these relationships after responsive scaling?

The page fails if visual labels, formula values, and answer logic disagree.

### Formula Rendering

Formulas must be readable, scalable, and connected to explanation.

Formula rendering must avoid tiny symbols, clipped fractions, broken line wrapping, unclear superscripts or subscripts, mobile overflow, and image-only formulas without accessible text.

A formula is not rendered correctly if it is visually present but too small, clipped, overflowing, or disconnected from its explanation.

### Formula Visualization And Interaction Requirement

For formula-centered HTML/blog pages, formula rendering is not only typesetting. A core computational formula should be turned into a visible mathematical structure that the learner can observe, compare, or manipulate.

Every core computational formula on a formula explainer page must have a corresponding 2D or 3D visual representation whenever practical. A text-only formula card is not sufficient for a core formula if the formula has a meaningful structure, transformation, geometric model, cancellation pattern, decomposition, recomposition, or parameter relationship that can be rendered.

Choose the representation by mathematical meaning:

- use 2D diagrams for area models, algebraic transformation steps, sign tables, coordinate relationships, function behavior, symbolic matching, or planar structure;
- use 3D models for cubic formulas, volume, solid decomposition, spatial subtraction, spatial recomposition, cross-sections, or formula structures whose terms correspond to cuboids, layers, or spatial blocks;
- use interactive controls such as sliders, steppers, toggles, scrubbable stages, term focus, hover/focus highlighting, drag, reset, and randomized checks when they help the learner test the formula structure;
- use linked formula highlighting so visual parts and symbolic terms explain each other.

For multi-formula pages, each core formula needs its own visual or interactive treatment. Reusing one visualization for several formulas is allowed only when the shared model explicitly shows each formula's distinct structure and state.

Negative terms, subtraction, and cancellation must still be visualized when they are central to the formula. Do not avoid visualization merely because a formula contains negative or signed quantities. Represent them with removal, cut-away regions, transparent subtraction volumes, signed blocks, opposite-color terms, paired cancellation, or staged comparison. Do not misrepresent signed quantities as ordinary positive physical pieces.

If a core formula cannot be visualized directly, the page must still provide an adjacent structural rendering of the closest meaningful object: a transformation diagram, cancellation map, factor-matching diagram, term correspondence table, or interactive algebraic state. Explain why this representation is used.

Formula interactions must have a learning purpose. They should help the learner see where terms come from, why coefficients appear, why signs change, why cancellation occurs, when a formula applies, or why a look-alike expression does not apply.

### Rendering Technology Choice

Choose rendering technology by teaching need.

Use SVG when the visual is diagrammatic, labels and shapes need to remain sharp, accessibility and responsiveness matter, and the number of elements is moderate.

Use Canvas when many objects need fast redraw, pixel-level animation is required, or procedural simulation is needed.

Use WebGL / Three.js only when 3D structure is essential, real-time 3D rendering is required, and a static 2D explanation would be insufficient.

Do not use WebGL, Three.js, GSAP, Framer Motion, or heavy animation libraries for simple static diagrams. Exceptions are allowed only when the existing project architecture already requires the library and using it reduces complexity.

### Responsive Rendering

HTML/blog pages must be readable and usable on desktop, tablet, and mobile.

Responsive rendering must preserve:

- reading order;
- formula readability;
- diagram clarity;
- control usability;
- feedback visibility.

A responsive page is not valid if it only scales everything down and makes the core idea unreadable. Complex interactions should reflow, simplify, or become step-based on small screens when necessary.

### Performance, Motion, And Fallbacks

Direct manipulation should feel immediate. Dragging, sliding, scrubbing, and parameter exploration should update without visible jank.

Avoid unnecessary animation loops; throttle, debounce, cache, or simplify expensive recalculation; lazy-load heavy visuals below the fold; avoid blocking the first learning content; and use performance optimization when heavy rendering is required.

Motion must clarify change, sequence, comparison, or causality. It must not loop endlessly without purpose, distract from reading, obscure formulas, make the learner wait for content, cause disruptive layout shifts, or replace missing explanation.

Motion must respect reduced-motion preferences. When motion is reduced, the page must still explain the concept through static states, labels, or step controls.

Heavy visual components must provide loading, fallback, and error states. If a visualization fails, the page should still provide the core explanation, a static diagram or textual fallback when possible, and a clear message instead of a blank area.

WebGL or 3D components must not be the only carrier of the concept.

### Browser Cleanliness And Failure Conditions

A rendered page must avoid broken assets, console errors during normal use, runtime crashes, hydration mismatches, disruptive layout shifts, clipped core content, unreadable contrast, overlapping controls, and broken reset or retry states.

When available, implementation should pass the project's build, lint, and type-check steps.

A rendered page fails if:

- formulas are clipped, tiny, overflowing, or unreadable;
- diagrams do not match the mathematical state;
- visual labels, formula values, and answer logic disagree;
- mobile layout breaks reading or interaction;
- important content depends only on hover;
- drag, slider, or animation interactions visibly stutter;
- heavy visuals block the first learning content;
- WebGL or Canvas failure leaves a blank learning section;
- animation causes distracting layout shifts;
- the page looks polished but is hard to read or use.

## Interaction / Rendering Plan

For pages with major visualizations, practice blocks, animations, or interactive components, produce an Interaction / Rendering Plan before implementation.

Use this shape:

```text
Interaction / Rendering Plan

Interaction:
- target concept:
- learner action:
- visible state changes:
- expected observation:
- feedback states:
- invalid states:
- retry/reset behavior:
- accessibility behavior:

Rendering:
- rendering technology:
- shared data model:
- formula rendering approach:
- responsive behavior:
- performance risks:
- loading/fallback states:
```

This plan prevents the page from becoming a collection of decorative widgets. It ensures that interaction and rendering serve the learning path.

## HTML / Blog Self-Check

Use this checklist before and after substantial HTML/blog implementation:

Source:

- Is every core explanation traceable to approved Markdown?
- Did implementation require Markdown backflow?

Learning path:

- Does the page begin with a question, confusion, or observable situation?
- Does it move from observation to explanation to formula to example to practice?
- Does it have a readable prose or instructional spine that creates learning momentum?

Page prose:

- Does the hero copy create a reason to continue?
- Does the page prose sound like learner-facing explanation rather than a design plan?
- Does every visible text block have a job?
- Are CTA labels meaningful learning actions?
- Are section headings conceptual turns rather than component labels?
- Are formula cards framed before they appear?
- Are visual prompts specific about what to observe?
- Does practice copy train judgment rather than only operation?
- Does feedback microcopy explain the learner's reasoning error?
- Is the tone clear, concrete, mathematically precise, and non-hype?

Text flow:

- Can the learner understand the core idea by reading the visible page from top to bottom?
- Is the main explanation hidden behind clicks, tabs, accordions, carousels, or scattered panels?
- Does the title plus first paragraph clearly state what the chapter is about?
- Does the first screen say what object is being studied, what confusion or contrast is being solved, and what the learner will be able to do?
- When text names an object, expression, formula, example, contrast, or judgment task, does the corresponding content appear immediately nearby?
- Do sections re-orient the learner instead of jumping between disconnected blocks?
- Are worked examples and self practice clearly distinguished?

Visualization:

- Is every visual introduced before use?
- Is every visual interpreted after use?
- Does it reveal mathematical structure?

Formula:

- Are formulas motivated?
- Are symbols explained?
- Are formulas connected to examples?
- Does every core computational formula have a corresponding 2D or 3D visual representation when practical?
- Do formula terms, coefficients, signs, cancellations, decompositions, or recompositions correspond to visible parts of the rendering?
- If a formula uses negative or signed quantities, are they rendered through removal, cut-away regions, signed blocks, cancellation, or another non-misleading structure?
- Are formula visuals interactive when interaction would help the learner test or vary the structure?

Interaction:

- Does every interaction have a learning purpose?
- Is state visible and reversible?
- Does feedback explain reasoning?
- Are invalid and retry states handled?

Practice:

- Are generated tasks valid and in scope?
- Does feedback address likely misconceptions?
- Can the learner retry or receive a new instance?

Rendering:

- Are formulas readable on mobile?
- Do diagram values, formula values, and answer logic agree?
- Are SVG / Canvas / WebGL choices justified by teaching need?
- Are loading, fallback, and error states present for heavy visuals?
- Is direct manipulation free from disruptive jank?

Accessibility:

- Can the page be used without hover-only explanations?
- Are focus states visible?
- Is feedback not color-only?
- Is reduced motion respected?

Review:

- Does the page pass build / lint / type check when available?
- Has `$ui-quality-reviewer` been used?
- Has `$performance-optimizer` been used when rendering is heavy?

Final principle:

```text
Interaction is not decoration.
Interaction is a way for the learner to test and revise understanding.

Rendering is not visual polish.
Rendering is the accurate, stable, and readable presentation of mathematical structure.

A page fails if it looks impressive but the learner cannot clearly see, manipulate, and explain the target idea.
```

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

Do not start writing new or substantially redesigned 3D code immediately. Before implementing a new or substantially redesigned 3D model, briefly state:

1. which mathematical topic or formula the model represents;
2. why 3D is needed instead of 2D;
3. what structure the model should help students see;
4. what students commonly misunderstand;
5. which geometric blocks compose the model;
6. what mathematical meaning each block represents.

If these points are not clear for a new or substantially redesigned 3D model, do not proceed to implementation.

For a small fix to an existing 3D model, identify the target model and verify that the fix does not break mathematical accuracy, controlled interaction, formula linkage, visual clarity, performance, or fallback behavior.

### Required Model Specification Table

Full 3D model specification tables are required for new or substantially redesigned 3D models.

Small fixes to existing 3D models only need target identification and verification that the fix does not break this 3D standard.

3D model specification tables belong to derived implementation planning, not core Markdown.

Before implementing a new or substantially redesigned 3D model, write a model specification table:

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

For decomposition or formula-block 3D models, prefer these states:

1. whole state;
2. separated state;
3. like-term or term-focus state;
4. reset state.

For other 3D mathematical models, define topic-appropriate learning states, such as observe state, parameter-change state, cross-section state, focus/highlight state, comparison state, and reset state.

Every state must support the mathematical learning purpose. Add other states only when useful, such as assembly, checking, error feedback, or completion.

If dragging is allowed, it must have preset directions, target slots, snapping rules, error rebound, and reset behavior. Do not allow users to drag the model into a mathematically broken state.

### Formula Linkage

3D models must not stand alone. They must be paired with formulas, rules, diagrams, or structural explanations.

For expression, decomposition, or formula-block models:

- The whole state should show the whole expression or structure.
- The separated state should show the decomposed expression or structure.
- Formula terms and model parts should highlight each other when useful.
- The formula explains the model, and the model explains the formula.

For non-expression 3D models:

- The model must still be paired with the relevant formula, rule, diagram, or structural explanation.
- Selecting a formula, label, parameter, or explanation step should highlight the corresponding model feature when useful.
- The model and explanation must remain mutually interpretable.

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
4. For decomposition or formula-block models, does the separated state reveal the formula source? For other models, do the topic-appropriate states reveal the target structure?
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
