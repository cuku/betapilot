#!/bin/bash
# BetaPilot Uninstaller
# Removes BetaPilot CLI and Claude Code plugin

set -e

NPM_PREFIX=$(npm config get prefix)
NPM_BIN="${NPM_PREFIX}/bin"

echo "Uninstalling BetaPilot..."

# Remove npm link
echo "Removing BetaPilot CLI..."
npm unlink betapilot 2>/dev/null || true

# Remove pilot symlink
if [ -L "${NPM_BIN}/pilot" ]; then
    rm "${NPM_BIN}/pilot"
    echo "Removed pilot symlink"
fi

# Remove Claude Code plugin
PLUGIN_DIR="${HOME}/.claude/plugins/betapilot"
if [ -d "$PLUGIN_DIR" ]; then
    echo "Removing Claude Code plugin..."
    rm -rf "$PLUGIN_DIR"
    echo "Removed plugin from $PLUGIN_DIR"
fi

# Optionally remove .pilot directory
if [ -d ".pilot" ]; then
    echo ""
    read -p "Remove .pilot directory from current project? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf .pilot
        echo "Removed .pilot directory"
    fi
fi

# Optionally remove from PATH in shell RC
echo ""
read -p "Remove BetaPilot from PATH in ~/.zshrc? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "$HOME/.zshrc" ]; then
        sed -i '' '/# BetaPilot/,/^$/d' "$HOME/.zshrc"
        echo "Removed BetaPilot PATH config"
    fi
fi

echo ""
echo "BetaPilot uninstalled!"
