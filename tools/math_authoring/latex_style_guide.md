# LaTeX And Markdown Math Style Guide

This guide keeps formulas readable and easier to check.

## 1. Use Markdown Math Delimiters Consistently

Use inline math for short expressions:

```markdown
当 $x\ne1$ 时，原式才有意义。
```

Use display math for derivations:

```markdown
$$
x^2-5x+6=(x-2)(x-3)
$$
```

Avoid mixing HTML formula fragments with Markdown math unless the page already
requires hand-written HTML.

## 2. Prefer Clear TeX Commands

Use:

```latex
\frac{x^2-1}{x-1}
\sqrt{(x-2)^2}
\ne
\ge
\le
\quad
\text{或}
```

Avoid relying on ambiguous plain-text symbols inside math when TeX commands are
clearer.

## 3. Do Not Use LaTeX As The Machine Check Source

LaTeX is for readers. Machine checks should use parser-friendly expressions:

```text
latex: \frac{x^2-1}{x-1}
check expression: (x**2 - 1)/(x - 1)
```

This avoids asking the checker to guess mathematical meaning from display code.

## 4. Long Derivations Should Be Stepwise

Do not compress several transformations into one line if any step changes
conditions or creates candidate solutions.

Good:

```markdown
$$
\sqrt{x+1}=x-1
$$

原式要求 $x-1\ge0$，所以 $x\ge1$。

$$
x+1=(x-1)^2
$$
```

## 5. Conditions Belong Beside Final Answers

For expressions:

```latex
\frac{x^2-1}{x-1}=x+1,\quad x\ne1
```

For equations:

```latex
x=3
```

only after candidate roots have been checked against the original equation.

For inequalities:

```latex
x<-2\quad \text{或}\quad x\ge1
```

with forbidden points excluded explicitly.

## 6. Rendering Check Requirements

Every Markdown or HTML formula should pass:

```text
delimiter balance
supported command check when KaTeX or MathJax validation is available
mobile overflow review for long display equations
```

