#!/bin/bash
set -e

echo ""
echo "🏛️  AI Architect Studio — Dev Server"
echo "======================================"
echo ""

# Check .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found. Run ./scripts/setup.sh first."
  exit 1
fi

# Check MISTRAL_API_KEY is set
if ! grep -q "MISTRAL_API_KEY=." .env.local; then
  echo "⚠️  WARNING: MISTRAL_API_KEY appears to be empty in .env.local"
  echo "   The app will fail on AI calls without it."
  echo "   Get your key at: https://console.mistral.ai"
  echo ""
fi

echo "Starting Next.js dev server..."
echo "Open: http://localhost:3000"
echo ""
npm run dev
