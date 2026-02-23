#!/usr/bin/env python3
"""
File Checker Hook - Run lint/format after file edits

This hook runs after Write/Edit tools to check code quality.
"""

import json
import os
import subprocess
import sys
from pathlib import Path

PILOT_DIR = Path(".pilot")
CONFIG_FILE = PILOT_DIR / "config.json"


def load_config():
    """Load BetaPilot config"""
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE) as f:
            return json.load(f)
    return {}


def get_language_from_file(file_path):
    """Detect language from file extension"""
    ext = Path(file_path).suffix.lower()

    mapping = {
        ".py": "python",
        ".js": "javascript",
        ".ts": "typescript",
        ".jsx": "javascript",
        ".tsx": "typescript",
        ".go": "go",
        ".rs": "rust",
        ".java": "java",
        ".c": "c",
        ".cpp": "c++",
        ".h": "c",
        ".hpp": "c++",
    }

    return mapping.get(ext, "unknown")


def run_check(file_path, config):
    """Run appropriate check based on file type"""
    lang = get_language_from_file(file_path)

    # Check if we have a test file - skip checks
    if "test" in file_path.lower() or file_path.endswith(".test."):
        return

    commands = {
        "python": ["python3", "-m", "ruff", "check", file_path],
        "javascript": ["npx", "eslint", file_path],
        "typescript": ["npx", "eslint", file_path],
    }

    cmd = commands.get(lang)
    if not cmd:
        return

    # Check if command exists
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)

        if result.returncode != 0:
            print(f"\n=== BetaPilot: Lint Issues in {file_path} ===", file=sys.stderr)
            print(result.stdout, file=sys.stderr)
            print(result.stderr, file=sys.stderr)
    except FileNotFoundError:
        pass  # Tool not installed, skip
    except Exception as e:
        pass  # Skip on any error


def main():
    """Main hook logic"""
    # Read tool input from Claude Code
    tool_input = os.environ.get("CLAUDE_TOOL_INPUT", "")

    if not tool_input:
        # Try reading from file argument
        if len(sys.argv) > 1:
            file_path = sys.argv[1]
        else:
            return
    else:
        try:
            data = json.loads(tool_input)
            file_path = data.get("path", "")
        except:
            return

    if not file_path or not Path(file_path).exists():
        return

    config = load_config()

    # Skip if file checking disabled
    if not config.get("autoLint", True):
        return

    run_check(file_path, config)


if __name__ == "__main__":
    main()
