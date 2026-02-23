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

echo "Installing BetaPilot from GitHub..."
npm install -g github:cuku/betapilot

echo ""
echo "BetaPilot installed successfully!"
pilot --version 2>/dev/null || echo "Run 'pilot --help' to get started"
