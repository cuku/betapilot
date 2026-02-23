#!/usr/bin/env python3
"""
Context Monitor Hook - Monitor context usage and suggest /learn

Warns at 80% (informational) and 90% (caution) context usage.
Suggests /learn at key thresholds.
"""

import json
import os
import sys
from pathlib import Path

# Thresholds
WARNING_80 = 0.80
WARNING_90 = 0.90

PILOT_DIR = Path(".pilot")
MEMORY_DIR = PILOT_DIR / "memory"


def get_context_usage():
    """Get current context usage from Claude Code"""
    # Claude Code provides context info via environment
    # Try to read from CLAUDE_CONTEXT_USAGE or similar

    usage_str = os.environ.get("CLAUDE_CONTEXT_PERCENTAGE", "")

    if not usage_str:
        return None

    try:
        return float(usage_str) / 100.0
    except:
        return None


def should_trigger_learn(usage):
    """Check if we should suggest /learn"""
    if usage is None:
        return False

    # Trigger at 80% and 90%
    return usage >= WARNING_80


def get_suggestion(usage):
    """Get appropriate suggestion based on usage"""
    if usage >= WARNING_90:
        return (
            "⚠️ Context at 90% - Consider running /learn to save current knowledge.\n"
            "This will preserve your discoveries for future sessions."
        )
    elif usage >= WARNING_80:
        return (
            "📚 Context at 80% - Consider running /learn to save important discoveries.\n"
            "This helps preserve knowledge before compaction."
        )
    return None


def main():
    """Main hook logic"""
    usage = get_context_usage()

    if usage is None:
        return

    suggestion = get_suggestion(usage)

    if suggestion:
        print(suggestion, file=sys.stderr)


if __name__ == "__main__":
    main()
