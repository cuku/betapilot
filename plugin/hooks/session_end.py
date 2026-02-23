#!/usr/bin/env python3
"""
Session End Hook - Save observations at end of session
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

PILOT_DIR = Path(".pilot")
MEMORY_DIR = PILOT_DIR / "memory"


def ensure_memory_dir():
    """Ensure memory directory exists"""
    MEMORY_DIR.mkdir(parents=True, exist_ok=True)


def load_sessions():
    """Load existing sessions"""
    sessions_file = MEMORY_DIR / "sessions.json"

    if sessions_file.exists():
        with open(sessions_file) as f:
            return json.load(f)

    return []


def save_session(observation):
    """Save session observation"""
    ensure_memory_dir()

    sessions = load_sessions()

    sessions.append(
        {"timestamp": datetime.now().isoformat(), "observation": observation}
    )

    # Keep last 50 sessions
    sessions = sessions[-50:]

    sessions_file = MEMORY_DIR / "sessions.json"
    with open(sessions_file, "w") as f:
        json.dump(sessions, f, indent=2)


def main():
    """Main hook logic"""
    print("BetaPilot: Session ending, saving observations...", file=sys.stderr)

    # Read observation from environment or file
    observation = os.environ.get("CLAUDE_SESSION_OBSERVATION", "")

    if observation:
        save_session(observation)
        print("BetaPilot: Observation saved", file=sys.stderr)
    else:
        print("BetaPilot: No observations to save", file=sys.stderr)


if __name__ == "__main__":
    main()
