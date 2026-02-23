#!/bin/bash
# BetaPilot Claude Code Plugin Installer
# Installs BetaPilot plugin to ~/.claude/plugins/betapilot

set -e

REPO="https://github.com/cuku/betapilot.git"
PLUGIN_DIR="${HOME}/.claude/plugins/betapilot"

echo "Installing BetaPilot Claude Code Plugin..."
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "Error: git is required but not installed"
    exit 1
fi

# Check if Claude Code is installed
if [ ! -d "${HOME}/.claude" ]; then
    echo "Warning: Claude Code not found at ~/.claude"
    echo "Installing anyway - you can set up later"
fi

# Create plugins directory
echo "Creating plugin directory..."
mkdir -p "${HOME}/.claude/plugins"

# Clone or update the plugin
if [ -d "$PLUGIN_DIR" ]; then
    echo "Updating existing installation..."
    cd "$PLUGIN_DIR"
    git pull
else
    echo "Cloning BetaPilot plugin..."
    git clone --depth 1 "$REPO" "$PLUGIN_DIR" --branch main
fi

# Make hooks executable
chmod +x "${PLUGIN_DIR}/plugin/hooks/"*.py 2>/dev/null || true

# Create .pilot directory in current directory if it doesn't exist
if [ ! -d ".pilot" ]; then
    echo "Creating .pilot directory..."
    mkdir -p .pilot/memory
    
    # Create default config
    cat > .pilot/config.json << 'EOF'
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "allowShellCommands": ["npm test", "npm run", "npm build", "npx"],
  "denyShellCommands": ["rm -rf", "format", "shutdown"],
  "testCommand": "npm test",
  "lintCommand": "npm run lint",
  "buildCommand": "npm run build",
  "deployCommand": "",
  "dryRunDefault": true,
  "verbose": false,
  "autoLint": true,
  "branchPrefix": "pilot/"
}
EOF

    # Create empty memory files
    echo "[]" > .pilot/memory/sessions.json
    echo "[]" > .pilot/memory/learned.json
    echo "{}" > .pilot/memory/context.json
fi

echo ""
echo "✓ BetaPilot plugin installed!"
echo ""
echo "Plugin location: $PLUGIN_DIR"
echo "Commands: /spec, /plan, /implement, /test, /review, /deploy, /sync, /learn, /doctor, /lint"
echo ""
echo "To use:"
echo "  1. Start Claude Code"
echo "  2. Run /sync to learn your codebase"
echo "  3. Run /spec to create a specification"
echo ""
