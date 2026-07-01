#!/usr/bin/env node
/*
 * Lightweight Markdown / HTML math checker for DGOpenKS.
 *
 * It checks delimiter balance without dependencies. If the optional `katex`
 * package is installed, it also tries to render every extracted formula with
 * throwOnError enabled.
 */

const fs = require("fs");
const path = require("path");

const DEFAULT_ROOTS = [
  "00_初高中衔接知识",
  "method_tree",
  "practice_tree",
];

const EXCLUDED_PARTS = [
  `chapter_00_江西中考数学快速回顾特辑`,
  `${path.sep}animations${path.sep}_render${path.sep}assets${path.sep}`,
  `${path.sep}assets${path.sep}three.min.js`,
];

let katex = null;
try {
  katex = require("katex");
} catch (_) {
  katex = null;
}

function walk(root, out = []) {
  if (!fs.existsSync(root)) return out;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (EXCLUDED_PARTS.some((part) => full.includes(part))) continue;
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(md|html)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function stripIgnoredBlocks(text, ext) {
  let result = text.replace(/```[\s\S]*?```/g, "");
  if (ext === ".html") {
    result = result
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<pre[\s\S]*?<\/pre>/gi, "")
      .replace(/<code[\s\S]*?<\/code>/gi, "");
  }
  return result;
}

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function isEscaped(text, index) {
  let count = 0;
  for (let i = index - 1; i >= 0 && text[i] === "\\"; i--) count++;
  return count % 2 === 1;
}

function extractMath(text, file) {
  const formulas = [];
  const errors = [];
  let i = 0;

  while (i < text.length) {
    if (text.startsWith("\\(", i)) {
      const end = text.indexOf("\\)", i + 2);
      if (end < 0) {
        errors.push({ file, line: lineOf(text, i), message: "Unclosed \\( ... \\)" });
        break;
      }
      formulas.push({ file, line: lineOf(text, i), displayMode: false, math: text.slice(i + 2, end) });
      i = end + 2;
      continue;
    }

    if (text.startsWith("\\[", i)) {
      const end = text.indexOf("\\]", i + 2);
      if (end < 0) {
        errors.push({ file, line: lineOf(text, i), message: "Unclosed \\[ ... \\]" });
        break;
      }
      formulas.push({ file, line: lineOf(text, i), displayMode: true, math: text.slice(i + 2, end) });
      i = end + 2;
      continue;
    }

    if (text[i] === "$" && !isEscaped(text, i)) {
      const displayMode = text[i + 1] === "$";
      const open = displayMode ? "$$" : "$";
      const start = i;
      i += displayMode ? 2 : 1;
      let end = -1;
      while (i < text.length) {
        if (text.startsWith(open, i) && !isEscaped(text, i)) {
          end = i;
          break;
        }
        if (!displayMode && /\r|\n/.test(text[i])) break;
        i++;
      }
      if (end < 0) {
        errors.push({ file, line: lineOf(text, start), message: `Unclosed ${open} math delimiter` });
        continue;
      }
      formulas.push({ file, line: lineOf(text, start), displayMode, math: text.slice(start + open.length, end) });
      i = end + open.length;
      continue;
    }

    i++;
  }

  return { formulas, errors };
}

function checkKatex(formulas) {
  if (!katex) return [];
  const errors = [];
  for (const formula of formulas) {
    try {
      katex.renderToString(formula.math, {
        displayMode: formula.displayMode,
        throwOnError: true,
        strict: "warn",
      });
    } catch (error) {
      errors.push({
        file: formula.file,
        line: formula.line,
        message: `KaTeX parse error: ${error.message}`,
      });
    }
  }
  return errors;
}

function main() {
  const roots = process.argv.slice(2);
  const targets = roots.length ? roots : DEFAULT_ROOTS;
  const files = targets.flatMap((root) => walk(root));
  let formulas = [];
  let errors = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const raw = fs.readFileSync(file, "utf8");
    const text = stripIgnoredBlocks(raw, ext);
    const result = extractMath(text, file);
    formulas = formulas.concat(result.formulas);
    errors = errors.concat(result.errors);
  }

  errors = errors.concat(checkKatex(formulas));

  console.log(`Checked files: ${files.length}`);
  console.log(`Extracted formulas: ${formulas.length}`);
  console.log(`KaTeX validation: ${katex ? "enabled" : "skipped (package not installed)"}`);

  if (errors.length) {
    console.error(`Math issues: ${errors.length}`);
    for (const error of errors) {
      console.error(`${error.file}:${error.line} ${error.message}`);
    }
    process.exit(1);
  }

  console.log("Math delimiter check passed.");
}

main();

