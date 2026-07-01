#!/usr/bin/env python
"""Lightweight schema checker for DGOpenKS structured practice files.

This checker supports JSON fully and YAML partially using a line-based fallback.
It is designed as a dependency-free first pass. A future version can replace the
fallback with PyYAML if the project chooses to add that dependency.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any


REQUIRED_TOP_LEVEL = [
    "id",
    "title",
    "stage",
    "source",
    "object_type",
    "task_goal",
    "knowledge",
    "method_nodes",
    "practice_nodes",
    "error_tags",
    "stem",
    "answer",
    "solution_steps",
    "checks",
    "feedback",
]

REQUIRED_FEEDBACK = ["correct", "common_errors"]
REQUIRED_SOURCE = ["chapter", "file"]

ALLOWED_METHOD_NODES = {
    "01_对象识别",
    "02_公式与结构判断",
    "03_多项式变形与因式分解",
    "04_条件控制与等价化简",
    "05_方程不等式与解集追踪",
}

ALLOWED_PRACTICE_NODES = {
    "01_对象识别练习",
    "02_结构判断练习",
    "03_方法执行练习",
    "04_条件检查练习",
    "05_综合迁移练习",
}

ALLOWED_METHOD_IDS = {
    "M_BRIDGE_001",
    "M_BRIDGE_002",
    "M_BRIDGE_003",
    "M_BRIDGE_004",
    "M_BRIDGE_005",
}

ALLOWED_PRACTICE_IDS = {
    "P_BRIDGE_001",
    "P_BRIDGE_002",
    "P_BRIDGE_003",
    "P_BRIDGE_004",
    "P_BRIDGE_005",
}

ALLOWED_ERROR_IDS = {
    "E_BRIDGE_001",
    "E_BRIDGE_002",
    "E_BRIDGE_003",
    "E_BRIDGE_004",
    "E_BRIDGE_005",
    "E_BRIDGE_006",
    "E_BRIDGE_007",
    "E_BRIDGE_008",
    "E_BRIDGE_009",
    "E_BRIDGE_010",
}


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def load_yaml_keys(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    keys = {}
    stack = [(-1, keys)]
    for raw in text.splitlines():
        if not raw.strip() or raw.lstrip().startswith("#") or raw.lstrip().startswith("- "):
            continue
        match = re.match(r"^(\s*)([A-Za-z0-9_\-\u4e00-\u9fff]+)\s*:", raw)
        if not match:
            continue
        indent = len(match.group(1))
        key = match.group(2)
        while stack and indent <= stack[-1][0]:
            stack.pop()
        parent = stack[-1][1]
        parent[key] = {}
        stack.append((indent, parent[key]))
    return keys


def load_problem(path: Path) -> dict[str, Any]:
    suffix = path.suffix.lower()
    if suffix == ".json":
        return load_json(path)
    if suffix in {".yaml", ".yml"}:
        return load_yaml_keys(path)
    raise ValueError("Expected .json, .yaml, or .yml")


def list_values(value: Any) -> set[str]:
    if isinstance(value, list):
        return {str(item) for item in value}
    return set()


def validate_problem(problem: dict[str, Any]) -> list[str]:
    issues = []
    for field in REQUIRED_TOP_LEVEL:
        if field not in problem:
            issues.append(f"missing top-level field: {field}")

    source = problem.get("source")
    if isinstance(source, dict):
        for field in REQUIRED_SOURCE:
            if field not in source:
                issues.append(f"missing source.{field}")

    feedback = problem.get("feedback")
    if isinstance(feedback, dict):
        for field in REQUIRED_FEEDBACK:
            if field not in feedback:
                issues.append(f"missing feedback.{field}")

    method_nodes = list_values(problem.get("method_nodes"))
    unknown_method = method_nodes - ALLOWED_METHOD_NODES
    if unknown_method:
        issues.append(f"unknown method_nodes: {', '.join(sorted(unknown_method))}")

    practice_nodes = list_values(problem.get("practice_nodes"))
    unknown_practice = practice_nodes - ALLOWED_PRACTICE_NODES
    if unknown_practice:
        issues.append(f"unknown practice_nodes: {', '.join(sorted(unknown_practice))}")

    method_ids = list_values(problem.get("method_ids"))
    unknown_method_ids = method_ids - ALLOWED_METHOD_IDS
    if unknown_method_ids:
        issues.append(f"unknown method_ids: {', '.join(sorted(unknown_method_ids))}")

    practice_ids = list_values(problem.get("practice_ids"))
    unknown_practice_ids = practice_ids - ALLOWED_PRACTICE_IDS
    if unknown_practice_ids:
        issues.append(f"unknown practice_ids: {', '.join(sorted(unknown_practice_ids))}")

    error_ids = list_values(problem.get("error_ids"))
    unknown_error_ids = error_ids - ALLOWED_ERROR_IDS
    if unknown_error_ids:
        issues.append(f"unknown error_ids: {', '.join(sorted(unknown_error_ids))}")

    if "conditions" in problem:
        conditions = problem["conditions"]
        if isinstance(conditions, dict) and conditions.get("must_preserve_original") and "original" not in conditions:
            issues.append("conditions.must_preserve_original is true but conditions.original is missing")

    return issues


def iter_problems(data: Any, path: Path):
    if isinstance(data, list):
        for index, problem in enumerate(data, start=1):
            yield f"{path}[{index}]", problem
        return
    yield str(path), data


def main(argv):
    if not argv:
        print("Usage: python tools/math_authoring/check_problem_schema.py problem.json|problem.yaml [...]", file=sys.stderr)
        return 2

    failures = []
    for arg in argv:
        path = Path(arg)
        try:
            data = load_problem(path)
        except Exception as exc:
            failures.append(f"{path}: {exc}")
            continue
        for label, problem in iter_problems(data, path):
            if not isinstance(problem, dict):
                failures.append(f"{label}: expected problem object")
                continue
            for issue in validate_problem(problem):
                failures.append(f"{label}: {issue}")

    if failures:
        print("Schema issues:", file=sys.stderr)
        for failure in failures:
            print(failure, file=sys.stderr)
        return 1

    print("Problem schema checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
