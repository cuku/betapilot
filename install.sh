#!/bin/bash
set -e

INSTALL_DIR="${HOME}/.local/bin"

echo "Installing BetaPilot..."

# Detect OS
OS="$(uname -s)"
case "$OS" in
  Linux*)     PLATFORM="linux";;
  Darwin*)   PLATFORM="darwin";;
  *)         echo "Unsupported OS: $OS"; exit 1;;
esac

# Detect architecture
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64)    ARCH_NAME="x64";;
  arm64|aarch64) ARCH_NAME="arm64";;
  *)         echo "Unsupported architecture: $ARCH"; exit 1;;
esac

# Create install directory
mkdir -p "$INSTALL_DIR"

# Check if npm is available
if command -v npm &> /dev/null; then
  echo "Installing BetaPilot via npm..."
  npm install -g betapilot
  
  echo ""
  echo "BetaPilot installed successfully!"
  pilot --version 2>/dev/null || echo "Run 'pilot --help' to get started"
else
  echo "npm is required to install BetaPilot."
  echo "Please install Node.js from https://nodejs.org or via your package manager."
  exit 1
fi
