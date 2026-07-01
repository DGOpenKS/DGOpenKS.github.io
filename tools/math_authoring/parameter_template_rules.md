# Parameterized Practice Template Rules

Parameterized practice helps fluency, but it must not generate invalid or
misleading questions.

## 1. Every Template Needs Constraints

A template must define:

```text
parameter names
allowed values
excluded values
degenerate cases
maximum coefficient size
expected method
expected answer form
checks
feedback focus
```

## 2. Avoid Degenerate Cases Unless The Goal Is To Teach Them

Examples:

```text
(mx+n)^2 with m=0 loses the quadratic structure.
x^2-n^2 with n=0 becomes x^2, not a normal square-difference case.
(x-a)/(x-b) with a=b collapses to 1 except for a hole.
```

If the degenerate case is intentional, mark it with:

```text
variant: degenerate
learning_goal: diagnose_condition_or_structure
```

## 3. Keep Numbers Small Enough To Reveal Structure

The purpose of bridge practice is structure recognition first.

Recommended:

```text
small integers
simple rational roots only when needed
avoid large coefficients unless the skill is already method execution
```

## 4. Required Checks By Template Family

### Complete Square

Check:

```text
middle term = 2ab
expanded form equals original
```

Error focus:

```text
missing-cross-term
middle-term-mismatch
```

### Difference Of Squares

Check:

```text
two square objects
subtraction, not addition
factor result expands back
```

Error focus:

```text
difference-required
object-mix
```

### Quadratic Trinomial Factorization

Check:

```text
product matches constant term
cross product or sum matches linear term
expanded factors equal original
```

Error focus:

```text
constant-only-factor
cross-product-error
no-multiply-back-check
```

### Rational Simplification

Check:

```text
factorization equivalent
cancelled factors are factors, not terms
original denominator zeros preserved
```

Error focus:

```text
factor-term-cancel
domain-lost
range-expanded
```

### Radical Simplification

Check:

```text
radicand condition
sqrt(A^2)=Abs(A)
piecewise form matches sign regions
```

Error focus:

```text
sqrt-absolute-missed
compound-condition-missed
```

### Inequality

Check:

```text
critical points sorted
sign intervals correct
endpoint inclusion matches relation
forbidden points excluded
```

Error focus:

```text
inequality-flip
endpoint-error
forbidden-point-included
unknown-sign-divide
```

## 5. Template Acceptance Checklist

Before using a template, ask:

```text
Can every generated item be solved within the current knowledge scope?
Can every generated answer be checked by algebra or sign analysis?
Are all original conditions explicit?
Can graph or number-line data be derived from the same parameters?
Does feedback map to existing error tags?
```

