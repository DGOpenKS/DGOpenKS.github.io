# Condition And Solution-Set Rules

These rules define the part that algebra equivalence alone cannot protect.

For DGOpenKS practice, a result is not complete until the original conditions and
final solution set are checked.

## 1. Rational Expressions

For a rational expression:

```text
A / B
```

the original condition is:

```text
B != 0
```

If a denominator factor is cancelled, the forbidden value remains.

Example:

```text
(x^2 - 1)/(x - 1) = x + 1
```

The expression form simplifies to `x + 1`, but the object is:

```text
x + 1, x != 1
```

Practice checks must distinguish:

```text
algebraic form: correct
condition preservation: required
```

## 2. Radical Expressions

For real-number content:

```text
sqrt(A)
```

requires:

```text
A >= 0
```

The result of a square root is nonnegative:

```text
sqrt(A^2) = |A|
```

It is not generally equal to `A`.

If a practice item asks for piecewise simplification, it must include the sign
split:

```text
|A| = A      when A >= 0
|A| = -A     when A < 0
```

## 3. Compound Conditions

When an expression contains several restrictions, all must be combined.

Example:

```text
sqrt(x + 2)/(x - 1)
```

requires:

```text
x + 2 >= 0
x - 1 != 0
```

The final domain is the intersection of all restrictions.

## 4. Equations

Equation transformations can create candidate results.

The following transformations require checking against the original equation:

```text
squaring both sides
multiplying by an expression containing the variable
clearing denominators
cancelling a factor containing the variable
dividing by an expression that may be zero
```

The answer workflow is:

```text
original restrictions
-> transformed equation
-> candidate solutions
-> substitute back or filter by restrictions
-> final solution set
```

## 5. Inequalities

For inequalities, the solver must track more than algebraic equality.

Rules:

```text
Multiplying or dividing by a known negative number flips the inequality sign.
Multiplying or dividing by an expression of unknown sign is not allowed without splitting cases.
Strict inequalities exclude equality points.
Non-strict inequalities may include zero points.
Forbidden points are always excluded.
```

For rational inequalities:

```text
(numerator)/(denominator) relation 0
```

the number line must include:

```text
numerator zeros
denominator zeros as forbidden points
interval sign analysis
endpoint inclusion / exclusion
```

## 6. Graph And Number-Line Conditions

A graph or number line is correct only if it matches the mathematical object.

Checklist:

```text
Do holes match removed denominator factors?
Are forbidden points open?
Are included endpoints solid?
Do shaded intervals match the final answer?
Does the graph show the original object's domain, not only the simplified formula?
Are labels placed on the correct points?
```

## 7. Feedback Rule

When a learner misses a condition, feedback should not say only "wrong".

Use this shape:

```text
错因：domain-lost
错在哪里：化简形式对了，但原式条件丢失。
应该检查：回到原分母，找所有不能为 0 的值。
正确思路：先写条件，再分解约分，最后把条件附在结果后。
```

