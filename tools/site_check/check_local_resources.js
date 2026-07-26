#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", ".venv", "node_modules", "_render", "renders"]);
const PAGE_EXTENSIONS = new Set([".html", ".css"]);
const ATTR_RE = /\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi;
const SRCSET_RE = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
const CSS_URL_RE = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".well-known") continue;
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath, output);
    else if (PAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) output.push(fullPath);
  }
  return output;
}

function isIgnoredReference(reference) {
  return (
    !reference ||
    reference.startsWith("#") ||
    reference.startsWith("//") ||
    /^(?:https?:|mailto:|tel:|data:|blob:|javascript:)/i.test(reference) ||
    /^(?:var|linear-gradient|radial-gradient|conic-gradient)\(/i.test(reference)
  );
}

function cleanReference(reference) {
  const clean = reference.trim().split("#", 1)[0].split("?", 1)[0];
  try {
    return decodeURIComponent(clean);
  } catch (_) {
    return clean;
  }
}

function resolveReference(sourceFile, reference) {
  const clean = cleanReference(reference);
  if (!clean) return null;
  const target = clean.startsWith("/")
    ? path.join(ROOT, clean.replace(/^\/+/, ""))
    : path.resolve(path.dirname(sourceFile), clean);
  if (!target.startsWith(ROOT + path.sep) && target !== ROOT) return null;
  return target;
}

function targetExists(target) {
  if (!target) return true;
  if (!fs.existsSync(target)) return false;
  if (fs.statSync(target).isDirectory()) return fs.existsSync(path.join(target, "index.html"));
  return true;
}

function collectReferences(file, text) {
  const references = [];
  const patterns = path.extname(file).toLowerCase() === ".css" ? [CSS_URL_RE] : [ATTR_RE, SRCSET_RE, CSS_URL_RE];
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      if (pattern === SRCSET_RE) {
        for (const candidate of match[1].split(",")) references.push(candidate.trim().split(/\s+/, 1)[0]);
      } else {
        references.push(match[1]);
      }
    }
  }
  return references;
}

const files = walk(ROOT);
const failures = [];
let checkedReferences = 0;

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const reference of collectReferences(file, text)) {
    if (isIgnoredReference(reference)) continue;
    checkedReferences += 1;
    const target = resolveReference(file, reference);
    if (!targetExists(target)) {
      failures.push({
        file: path.relative(ROOT, file),
        reference,
        target: target ? path.relative(ROOT, target) : "outside repository",
      });
    }
  }
}

console.log(`Checked source files: ${files.length}`);
console.log(`Checked local references: ${checkedReferences}`);

if (failures.length) {
  console.error(`Broken local references: ${failures.length}`);
  for (const failure of failures) {
    console.error(`- ${failure.file}: ${failure.reference} -> ${failure.target}`);
  }
  process.exit(1);
}

console.log("Local link and resource check passed.");
