#!/usr/bin/env python
"""Optional SymPy-based algebra checker for DGOpenKS problem files.

The script accepts JSON problem files that follow problem_schema.yaml. YAML can
be checked by check_problem_schema.py, but algebra evaluation is intentionally
limited to JSON unless a future YAML dependency is added.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def require_sympy():
    try:
        import sympy as sp  # type: ignore
        from sympy.parsing.sympy_parser import parse_expr  # type: ignore
    except Exception as exc:  # pragma: no cover - depends on environment
        print("SymPy is not installed. Algebra checks are skipped.", file=sys.stderr)
        print(f"Install later with: python -m pip install sympy", file=sys.stderr)
        print(f"Original import error: {exc}", file=sys.stderr)
        return None, None
    return sp, parse_expr


def parse_symbols(sp, names):
    if not names:
        return {}
    symbols = sp.symbols(" ".join(names), real=True)
    if len(names) == 1:
        symbols = (symbols,)
    return dict(zip(names, symbols))


def check_equivalence(sp, parse_expr, check):
    variables = check.get("variables", [])
    local_dict = parse_symbols(sp, variables)
    lhs = parse_expr(check["lhs"], local_dict=local_dict)
    rhs = parse_expr(check["rhs"], local_dict=local_dict)
    return sp.simplify(lhs - rhs) == 0


def check_equation_solution(sp, parse_expr, check):
    variables = check.get("variables", [])
    if len(variables) != 1:
        raise ValueError("equation_solution currently expects exactly one variable")
    local_dict = parse_symbols(sp, variables)
    variable = local_dict[variables[0]]
    expr = parse_expr(check["equation"], local_dict=local_dict)
    final = {parse_expr(str(value), local_dict=local_dict) for value in check.get("final_solutions", [])}
    for candidate in check.get("candidate_solutions", []):
        value = parse_expr(str(candidate), local_dict=local_dict)
        is_solution = sp.simplify(expr.subs(variable, value)) == 0
        if value in final and not is_solution:
            return False
        if value not in final and is_solution:
            return False
    return True


def check_problem(problem, sp, parse_expr):
    failures = []
    for index, check in enumerate(problem.get("checks", []), start=1):
        kind = check.get("type")
        try:
            if kind == "algebra_equivalence":
                ok = check_equivalence(sp, parse_expr, check)
            elif kind == "equation_solution":
                ok = check_equation_solution(sp, parse_expr, check)
            else:
                continue
        except Exception as exc:
            failures.append(f"check {index} ({kind}) raised {exc}")
            continue
        if not ok:
            failures.append(f"check {index} ({kind}) failed")
    return failures


def iter_problems(data, path: Path):
    if isinstance(data, list):
        for index, problem in enumerate(data, start=1):
            yield f"{path}[{index}]", problem
        return
    yield str(path), data


def main(argv):
    paths = [Path(arg) for arg in argv]
    if not paths:
        print("Usage: python tools/math_authoring/check_algebra.py problem.json [...]", file=sys.stderr)
        return 2

    sp, parse_expr = require_sympy()
    if sp is None:
        return 0

    failures = []
    for path in paths:
        if path.suffix.lower() != ".json":
            print(f"Skipping {path}: algebra checker currently expects JSON.", file=sys.stderr)
            continue
        data = load_json(path)
        for label, problem in iter_problems(data, path):
            if not isinstance(problem, dict):
                failures.append(f"{label}: expected problem object")
                continue
            for failure in check_problem(problem, sp, parse_expr):
                failures.append(f"{label}: {failure}")

    if failures:
        print("Algebra check failures:", file=sys.stderr)
        for failure in failures:
            print(failure, file=sys.stderr)
        return 1

    print("Algebra checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
