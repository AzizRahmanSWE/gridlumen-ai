"""CLI entry point — full implementation in task P1."""

from __future__ import annotations

import argparse
import sys

MANDATORY_DISCLAIMER = (
    "Representative prototype data only; not an operational outage forecast "
    "or equipment-failure prediction."
)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="GridLumen deterministic risk engine (scaffold — implement in P1)"
    )
    parser.add_argument("--scenario", choices=["normal", "storm", "heatwave_ev"])
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--copy-to-web", action="store_true")
    args = parser.parse_args(argv)

    if not args.scenario and not args.all:
        parser.error("Specify --scenario or --all")
        print(
            "\nScaffold only: run task P1 to generate outputs from engine/data/demo/scenarios.json",
            file=sys.stderr,
        )
        return 2

    print(MANDATORY_DISCLAIMER)
    print("Risk engine not yet implemented — complete CURSOR_TASKS.md task P1.", file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
