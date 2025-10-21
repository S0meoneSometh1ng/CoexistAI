#!/bin/bash
# Setup script to link backend directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_SRC="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔗 Setting up backend link..."
echo "Source: $BACKEND_SRC"
echo "Target: $SCRIPT_DIR/backend"

# Create symlink to parent directory (where Python backend lives)
if [ ! -L "$SCRIPT_DIR/backend" ]; then
  ln -s "$BACKEND_SRC" "$SCRIPT_DIR/backend"
  echo "✅ Backend linked successfully"
else
  echo "ℹ️  Backend link already exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building TypeScript..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  npm start"
echo ""
echo "Or install globally:"
echo "  npm install -g ."
echo "  coexistai-mcp"
