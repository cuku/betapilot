#!/usr/bin/env python3
"""
Session Start Hook - Load persistent memory on session start
"""

import json
import os
from pathlib import Path

PILOT_DIR = Path(".pilot")
MEMORY_DIR = PILOT_DIR / "memory"


def load_memory():
    """Load persistent memory from .pilot/memory/"""
    if not MEMORY_DIR.exists():
        return {"sessions": [], "learned": [], "context": {}}

    data = {"sessions": [], "learned": [], "context": {}}

    # Load sessions
    sessions_file = MEMORY_DIR / "sessions.json"
    if sessions_file.exists():
        with open(sessions_file) as f:
            data["sessions"] = json.load(f)

    # Load learned knowledge
    learned_file = MEMORY_DIR / "learned.json"
    if learned_file.exists():
        with open(learned_file) as f:
            data["learned"] = json.load(f)

    # Load active context
    context_file = MEMORY_DIR / "context.json"
    if context_file.exists():
        with open(context_file) as f:
            data["context"] = json.load(f)

    return data


def main():
    """Main hook logic"""
    memory = load_memory()

    # Output memory for Claude to use
    if memory["learned"]:
        print("=== Learned Knowledge ===")
        for item in memory["learned"][-5:]:  # Last 5 items
            print(f"- {item.get('title', 'Untitled')}")
            print(f"  {item.get('content', '')[:200]}...")

    if memory["context"]:
        print("\n=== Active Context ===")
        ctx = memory["context"]
        if "current_plan" in ctx:
            print(f"Plan: {ctx['current_plan']}")
        if "tasks" in ctx:
            print(f"Tasks: {len(ctx['tasks'])} remaining")


if __name__ == "__main__":
    main()
