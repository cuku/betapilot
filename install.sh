#!/bin/bash
set -e

INSTALL_DIR="${HOME}/.local/bin"

echo "Installing BetaPilot..."

# Check if npm is available
if ! command -v npm &> /dev/null; then
  echo "npm is required to install BetaPilot."
  echo "Please install Node.js from https://nodejs.org or via your package manager."
  exit 1
fi

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
pilot --version 2>/dev/null || pilot help
