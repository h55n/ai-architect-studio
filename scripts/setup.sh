#!/bin/bash
set -e

echo ""
echo "🏛️  AI Architect Studio — Setup"
echo "================================"
echo ""

# Check for required tools
check_tool() {
  if ! command -v $1 &> /dev/null; then
    echo "❌ $1 is required but not installed."
    echo "   Install: $2"
    exit 1
  else
    echo "✅ $1 found: $(command -v $1)"
  fi
}

echo "Checking prerequisites..."
check_tool node "https://nodejs.org (v18.17.0+)"
check_tool npm "https://nodejs.org"

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js v18+ required. Found: $(node -v)"
  exit 1
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "📋 Setting up environment..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "✅ Created .env.local from .env.example"
  echo ""
  echo "⚠️  ACTION REQUIRED:"
  echo "   Open .env.local and add your Mistral API key:"
  echo "   MISTRAL_API_KEY=your_key_here"
  echo ""
  echo "   Get your key at: https://console.mistral.ai"
else
  echo "✅ .env.local already exists — skipping"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local with your MISTRAL_API_KEY"
echo "  2. Run ./scripts/dev.sh to start the development server"
echo "  3. Open MASTER_PROMPT.md and paste into Claude Code to begin building"
echo ""
