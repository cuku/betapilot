#!/usr/bin/env python3
"""
Pre-Compact Hook - Save state before auto-compaction

This hook runs BEFORE Claude Code's automatic context compaction.
It captures the current BetaPilot state so it can be restored after.
"""

import json
import os
import sys
from pathlib import Path

PILOT_DIR = Path(".pilot")
MEMORY_DIR = PILOT_DIR / "memory"


def ensure_memory_dir():
    """Ensure memory directory exists"""
    MEMORY_DIR.mkdir(parents=True, exist_ok=True)


def load_current_state():
    """Load current BetaPilot state"""
    state = {
        "current_spec": "",
        "current_plan": "",
        "tasks": [],
        "active_plan_file": "",
        "session_notes": [],
    }

    # Read spec
    spec_file = PILOT_DIR / "spec.md"
    if spec_file.exists():
        state["current_spec"] = spec_file.read_text()

    # Read plan
    plan_file = PILOT_DIR / "plan.md"
    if plan_file.exists():
        state["current_plan"] = plan_file.read_text()

    # Read context
    context_file = PILOT_DIR / "context.md"
    if context_file.exists():
        state["context"] = context_file.read_text()

    return state


def save_state(state):
    """Save state to memory"""
    ensure_memory_dir()

    context_file = MEMORY_DIR / "context.json"
    with open(context_file, "w") as f:
        json.dump(state, f, indent=2)


def main():
    """Main hook logic"""
    print("BetaPilot: Saving state before compaction...", file=sys.stderr)

    state = load_current_state()
    save_state(state)

    print(
        f"BetaPilot: Saved spec ({len(state['current_spec'])} chars)", file=sys.stderr
    )
    print(
        f"BetaPilot: Saved plan ({len(state['current_plan'])} chars)", file=sys.stderr
    )
    print("BetaPilot: State saved successfully", file=sys.stderr)


if __name__ == "__main__":
    main()
