# DGOpenKS Math Authoring

This directory defines the first layer of the DGOpenKS math authoring and
checking workflow.

It is not a new knowledge source. It is a tool layer for future method-tree and
practice-tree production. The goal is to keep algebra, conditions, graphs,
number lines, feedback, and error tags consistent before practice pages become
large or parameterized.

## What This Layer Checks

The practice tree must not only ask questions. Each question should preserve the
same logic used in the knowledge tree:

```text
identify object
-> judge structure
-> execute method
-> check conditions
-> transfer or verify result
```

This tool layer therefore separates five kinds of correctness:

```text
1. Markdown and formula syntax
2. Algebraic equivalence
3. Original conditions and solution-set restrictions
4. Graph / number-line consistency
5. Error-tag and feedback alignment
```

## Files

| File | Purpose |
| --- | --- |
| `problem_schema.yaml` | Required structure for future practice items |
| `graph_schema.yaml` | Required structure for graphs, number lines, holes, endpoints, and intervals |
| `condition_rules.md` | Rules for rational expressions, radicals, equations, and inequalities |
| `latex_style_guide.md` | Formula writing rules for Markdown and HTML content |
| `parameter_template_rules.md` | Rules for parameterized practice templates |
| `error_tag_rules.md` | Rules for using method-tree error tags in practice feedback |
| `check_markdown_math.js` | Lightweight Markdown / HTML math delimiter checker; uses KaTeX if installed |
| `check_algebra.py` | Algebra check runner; uses SymPy if installed |
| `check_problem_schema.py` | Lightweight problem file schema checker |

## Current Dependency Policy

The scripts are intentionally usable without adding project dependencies.

- `check_markdown_math.js` runs with Node only. If `katex` is installed, it also
  validates formula rendering.
- `check_algebra.py` runs with Python. If `sympy` is installed, it validates
  declared algebra checks.
- `check_problem_schema.py` runs with Python standard library only.

This lets the project keep working now, while leaving a clear path to stronger
checks later.

## Suggested Commands

Run formula delimiter checks over the current learning content:

```powershell
node tools/math_authoring/check_markdown_math.js
```

Run algebra checks for future problem files:

```powershell
python tools/math_authoring/check_algebra.py path\to\problem.json
```

Run schema checks for future problem files:

```powershell
python tools/math_authoring/check_problem_schema.py path\to\problem.json
```

Run the included sample:

```powershell
python tools/math_authoring/check_problem_schema.py tools\math_authoring\examples\RATIONAL_SIMPLIFY_CONDITION_001.json
python tools/math_authoring/check_algebra.py tools\math_authoring\examples\RATIONAL_SIMPLIFY_CONDITION_001.json
```

## Authoring Rule

A practice item is not accepted only because the displayed answer looks right.
It should pass these questions:

```text
Can the formula render?
Does the algebraic transformation check out?
Are original conditions preserved?
Does the graph or number line match the solution set?
Does feedback point to the actual layer of error?
```
