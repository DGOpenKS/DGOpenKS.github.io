# Error Tag And Feedback Rules

Error tags connect practice answers back to method-tree reasoning.

They should not become labels pasted after the fact. A tag is valid only when
feedback can explain the missing structure or condition.

## 1. Feedback Shape

Use:

```text
错因：tag
错在哪里：specific error
应该检查：the missing structure or condition
正确思路：next executable step
```

Do not use:

```text
答案错误。
重新计算。
注意符号。
```

## 2. Tag Groups

### Object Recognition

Use when the learner chose a method that does not match the object or goal.

Examples:

```text
object-mix
direction-mix
task-mismatch
function-expression-mix
```

### Formula Structure

Use when the learner matched the wrong formula structure.

Examples:

```text
missing-cross-term
middle-term-mismatch
difference-required
whole-cube-misread
cube-factor-sign
```

### Factorization

Use when the factorization method or check fails.

Examples:

```text
common-factor-missed
constant-only-factor
cross-product-error
grouping-no-common-bracket
whole-expanded-too-early
complete-square-balance
no-multiply-back-check
```

### Condition Control

Use when the algebraic form may be right but the mathematical object changes.

Examples:

```text
domain-lost
factor-term-cancel
sqrt-absolute-missed
compound-condition-missed
range-expanded
```

### Solution-Set Tracking

Use when the final set is wrong after transformation or sign analysis.

Examples:

```text
candidate-as-answer
extraneous-root
solution-lost
inequality-flip
unknown-sign-divide
endpoint-error
forbidden-point-included
```

## 3. Tag Selection Rule

Choose the earliest layer where the learner went wrong.

Example:

If a learner solves a rational inequality by multiplying both sides by
`x-1` without knowing its sign, the primary tag is:

```text
unknown-sign-divide
```

If the resulting endpoint is also wrong, that is secondary:

```text
endpoint-error
```

The feedback should first address the unknown-sign operation.

## 4. Graph Feedback Rule

For graph or number-line mistakes, use both:

```text
math error tag
visual consistency message
```

Example:

```text
错因：forbidden-point-included
图像问题：分母禁点画成了实心点。
应该检查：分母为 0 的点永远不能进入解集。
```

