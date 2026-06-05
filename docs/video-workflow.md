# Video Workflow

This project is a static blog/front-end site. Video work should create derived files only and should not rewrite source chapters or blog content.

## Blog To Video

Use `$blog-to-video` when the source is a blog article or chapter and the goal is a short video draft.

Typical flow:

1. Identify the exact source file.
2. Read only the needed source content.
3. Create a storyboard and script in a video output folder.
4. Keep the original blog file unchanged.
5. Hand the storyboard to `$hyperframes` only when an actual video composition is needed.

## Content To Video

Use `$content-to-video` for Markdown, MDX, text notes, paper notes, or technical documentation.

First produce:

- Hook
- Audience
- Key message
- Scene list
- Narration
- Subtitle text
- Visual direction

Do not change the source document when producing the video plan.

## HyperFrames Handoff

Use `$hyperframes` after a storyboard exists.

Recommended commands inside the HyperFrames composition directory:

```bash
npx hyperframes preview
npx hyperframes lint
npx hyperframes render index.html
```

## Recommended Directory Structure

```txt
blog/
  article-1.md

video/
  article-1/
    storyboard.md
    script.md
    hyperframes/
      index.html
      style.css
      package.json
```

For this repository, use `video/`, `hyperframes/`, `generated-video/`, or a user-specified directory for generated video artifacts.

## Keep Blog And Video Separate

- Treat blog chapters and source posts as read-only during video generation.
- Put summaries, scripts, subtitles, and HyperFrames files in a separate generated directory.
- If a summary is needed, create it as a derived artifact such as `video/<slug>/script.md`.
- Do not move Markdown, HTML chapters, or existing assets for video work.

## Low Token Workflow

- Do not scan the whole repository unless needed.
- Start by reading only the target source file.
- For long posts, create a storyboard before writing scenes.
- Generate one scene at a time for larger videos.
- Reuse existing video plans rather than regenerating full projects.
- Summarize changed files after each edit.
