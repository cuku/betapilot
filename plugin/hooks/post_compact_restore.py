#!/usr/bin/env python3
"""
Post-Compact Restore Hook - Restore state after auto-compaction

This hook runs AFTER Claude Code's automatic context compaction.
It restores the BetaPilot state that was saved by pre_compact.py.
"""

import json
import sys
from pathlib import Path

PILOT_DIR = Path(".pilot")
MEMORY_DIR = PILOT_DIR / "memory"


def load_saved_state():
    """Load saved state from memory"""
    context_file = MEMORY_DIR / "context.json"

    if not context_file.exists():
        return None

    with open(context_file) as f:
        return json.load(f)


def restore_state(state):
    """Restore state to BetaPilot files"""
    if not state:
        return

    # Restore spec
    if "current_spec" in state and state["current_spec"]:
        spec_file = PILOT_DIR / "spec.md"
        spec_file.write_text(state["current_spec"])
        print(
            f"BetaPilot: Restored spec ({len(state['current_spec'])} chars)",
            file=sys.stderr,
        )

    # Restore plan
    if "current_plan" in state and state["current_plan"]:
        plan_file = PILOT_DIR / "plan.md"
        plan_file.write_text(state["current_plan"])
        print(
            f"BetaPilot: Restored plan ({len(state['current_plan'])} chars)",
            file=sys.stderr,
        )

    # Restore context
    if "context" in state and state["context"]:
        context_file = PILOT_DIR / "context.md"
        context_file.write_text(state["context"])


def main():
    """Main hook logic"""
    print("BetaPilot: Restoring state after compaction...", file=sys.stderr)

    state = load_saved_state()

    if state:
        restore_state(state)
        print("BetaPilot: State restored successfully", file=sys.stderr)
    else:
        print("BetaPilot: No saved state found", file=sys.stderr)


if __name__ == "__main__":
    main()
