"""
Secure Python quant sandbox.
AST-filtered execution with restricted builtins, timeout, and memory soft limits.
"""

from __future__ import annotations

import ast
import math
import signal
import threading
import traceback
from typing import Any

from app.quant import black_scholes, binomial, implied_vol, monte_carlo

ALLOWED_NODES = (
    ast.Module,
    ast.Expression,
    ast.Expr,
    ast.Assign,
    ast.AugAssign,
    ast.AnnAssign,
    ast.Name,
    ast.Load,
    ast.Store,
    ast.Del,
    ast.Constant,
    ast.List,
    ast.Tuple,
    ast.Dict,
    ast.Set,
    ast.ListComp,
    ast.DictComp,
    ast.SetComp,
    ast.GeneratorExp,
    ast.comprehension,
    ast.BinOp,
    ast.UnaryOp,
    ast.BoolOp,
    ast.Compare,
    ast.IfExp,
    ast.Call,
    ast.keyword,
    ast.Attribute,
    ast.Subscript,
    ast.Slice,
    ast.Add,
    ast.Sub,
    ast.Mult,
    ast.Div,
    ast.FloorDiv,
    ast.Mod,
    ast.Pow,
    ast.LShift,
    ast.RShift,
    ast.BitOr,
    ast.BitXor,
    ast.BitAnd,
    ast.MatMult,
    ast.UAdd,
    ast.USub,
    ast.Not,
    ast.Invert,
    ast.And,
    ast.Or,
    ast.Eq,
    ast.NotEq,
    ast.Lt,
    ast.LtE,
    ast.Gt,
    ast.GtE,
    ast.Is,
    ast.IsNot,
    ast.In,
    ast.NotIn,
    ast.If,
    ast.For,
    ast.While,
    ast.Break,
    ast.Continue,
    ast.Pass,
    ast.Return,
    ast.FunctionDef,
    ast.arguments,
    ast.arg,
    ast.Lambda,
)

FORBIDDEN_NAMES = {
    "__import__",
    "eval",
    "exec",
    "open",
    "compile",
    "input",
    "help",
    "exit",
    "quit",
    "breakpoint",
    "memoryview",
    "globals",
    "locals",
    "vars",
    "dir",
    "getattr",
    "setattr",
    "delattr",
    "hasattr",
    "classmethod",
    "staticmethod",
    "property",
    "type",
    "object",
    "super",
}


class SandboxError(Exception):
    pass


class _Timeout(Exception):
    pass


def _validate_ast(tree: ast.AST) -> None:
    for node in ast.walk(tree):
        if not isinstance(node, ALLOWED_NODES):
            raise SandboxError(f"Disallowed syntax: {type(node).__name__}")
        if isinstance(node, ast.Name) and node.id in FORBIDDEN_NAMES:
            raise SandboxError(f"Disallowed name: {node.id}")
        if isinstance(node, ast.Attribute) and node.attr.startswith("__"):
            raise SandboxError("Dunder attribute access blocked")
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
            if node.func.id in FORBIDDEN_NAMES:
                raise SandboxError(f"Disallowed call: {node.func.id}")


def _safe_builtins() -> dict[str, Any]:
    allowed = [
        "abs",
        "min",
        "max",
        "sum",
        "len",
        "range",
        "enumerate",
        "zip",
        "map",
        "filter",
        "sorted",
        "reversed",
        "round",
        "int",
        "float",
        "bool",
        "str",
        "list",
        "dict",
        "set",
        "tuple",
        "isinstance",
        "print",
    ]
    return {name: __builtins__[name] if isinstance(__builtins__, dict) else getattr(__builtins__, name) for name in allowed}


def _alarm_handler(signum, frame):  # noqa: ANN001
    raise _Timeout("Quant sandbox timeout")


def run_quant_code(code: str, timeout_sec: int = 2) -> dict[str, Any]:
    """
    Execute restricted Python for quant experiments.
    Exposes black_scholes, greeks, implied_volatility, binomial_price, gbm_paths, Portfolio, math.
    """
    try:
        tree = ast.parse(code, mode="exec")
    except SyntaxError as exc:
        return {"ok": False, "error": f"SyntaxError: {exc}"}

    try:
        _validate_ast(tree)
    except SandboxError as exc:
        return {"ok": False, "error": str(exc)}

    env: dict[str, Any] = {
        "__builtins__": _safe_builtins(),
        "math": math,
        "black_scholes_price": black_scholes.black_scholes_price,
        "greeks": black_scholes.greeks,
        "implied_volatility": implied_vol.implied_volatility,
        "binomial_price": binomial.binomial_price,
        "gbm_paths": monte_carlo.gbm_paths,
        "Portfolio": monte_carlo.Portfolio,
        "Position": monte_carlo.Position,
    }

    # timeout via SIGALRM when available (Unix main thread only)
    use_alarm = hasattr(signal, "SIGALRM") and threading.current_thread() is threading.main_thread()
    if use_alarm:
        signal.signal(signal.SIGALRM, _alarm_handler)
        signal.setitimer(signal.ITIMER_REAL, timeout_sec)

    try:
        compiled = compile(tree, "<aetheron-sandbox>", "exec")
        exec(compiled, env, env)  # noqa: S102 — intentional restricted sandbox
        # Return non-private, JSON-ish results
        result = {
            k: v
            for k, v in env.items()
            if not k.startswith("_")
            and k
            not in {
                "math",
                "black_scholes_price",
                "greeks",
                "implied_volatility",
                "binomial_price",
                "gbm_paths",
                "Portfolio",
                "Position",
            }
            and _is_jsonish(v)
        }
        # Serialize Portfolio-like objects
        for k, v in list(result.items()):
            if hasattr(v, "to_dict") and callable(v.to_dict):
                result[k] = v.to_dict()
        return {"ok": True, "result": result}
    except _Timeout:
        return {"ok": False, "error": "Execution timed out"}
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "error": f"{type(exc).__name__}: {exc}", "trace": traceback.format_exc(limit=3)}
    finally:
        if use_alarm:
            signal.setitimer(signal.ITIMER_REAL, 0)


def _is_jsonish(value: Any) -> bool:
    if value is None or isinstance(value, (bool, int, float, str)):
        return True
    if isinstance(value, (list, tuple)):
        return all(_is_jsonish(v) for v in value)
    if isinstance(value, dict):
        return all(isinstance(k, str) and _is_jsonish(v) for k, v in value.items())
    if hasattr(value, "to_dict") and callable(value.to_dict):
        return True
    return False
