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

# Add to PATH for this session
export PATH="${NPM_BIN}:$PATH"

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

# Try to run pilot
if command -v pilot &> /dev/null; then
  pilot --version 2>/dev/null || pilot help
else
  echo "To use pilot, add the following to your PATH:"
  echo "  export PATH=\"${NPM_BIN}:\$PATH\""
  echo ""
  echo "Add this line to your ~/.zshrc or ~/.bashrc"
fi
