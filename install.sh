#!/bin/bash
# BetaPilot installer
set -e

echo "Installing BetaPilot..."

# Check if npm is available
if ! command -v npm &> /dev/null; then
  echo "npm is required to install BetaPilot."
  echo "Please install Node.js from https://nodejs.org or via your package manager."
  exit 1
fi

# Get npm global bin path
NPM_PREFIX=$(npm config get prefix)
NPM_BIN="${NPM_PREFIX}/bin"

# Create temp dir
TMPDIR=$(mktemp -d)
cd "$TMPDIR"

# Clone the repo
echo "Cloning BetaPilot..."
git clone https://github.com/cuku/betapilot.git
cd betapilot

# Install dependencies and build
echo "Building BetaPilot..."
npm install
npm run build

# Link globally
echo "Linking BetaPilot..."
npm link

cd /
rm -rf "$TMPDIR"

echo ""
echo "BetaPilot installed successfully!"
echo ""

# Add to PATH if not already
SHELL_RC=""
if [ -f "$HOME/.zshrc" ]; then
  SHELL_RC="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
  SHELL_RC="$HOME/.bashrc"
fi

if [ -n "$SHELL_RC" ]; then
  if ! grep -q "NPM_BIN\|homebrew/bin" "$SHELL_RC" 2>/dev/null; then
    echo "" >> "$SHELL_RC"
    echo "# BetaPilot" >> "$SHELL_RC"
    echo "export PATH=\"${NPM_BIN}:\$PATH\"" >> "$SHELL_RC"
    echo "Added ${NPM_BIN} to your PATH in ${SHELL_RC}"
    echo "Please restart your terminal or run: source ${SHELL_RC}"
  fi
fi

# Try to run pilot
export PATH="${NPM_BIN}:$PATH"
if command -v pilot &> /dev/null; then
  pilot help
else
  echo ""
  echo "To use pilot, run:"
  echo "  export PATH=\"${NPM_BIN}:\$PATH\""
fi
