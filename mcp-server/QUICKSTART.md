# Quick Start - Developer Guide

## 🚀 Get It Running in 2 Minutes

### Step 1: Setup

```bash
cd /workspaces/CoexistAI/mcp-server
./setup-backend.sh
```

This will:
- Link the backend directory
- Install npm dependencies
- Build TypeScript

### Step 2: Test Locally

```bash
# Start the server
npm start
```

You should see:
```
🚀 Starting CoexistAI MCP Server...
🐳 Starting backend services...
✅ Docker is available
🚀 Starting Docker Compose...
⏳ Waiting for services to be healthy...
✅ All services healthy
✅ Backend services ready
✅ CoexistAI MCP Server ready
```

### Step 3: Test with MCP Inspector

```bash
# In another terminal
npx @modelcontextprotocol/inspector node build/index.js
```

This opens a web UI to test all tools.

### Step 4: Configure Claude Desktop

```bash
# macOS
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

Add:
```json
{
  "mcpServers": {
    "coexistai": {
      "command": "node",
      "args": ["/workspaces/CoexistAI/mcp-server/build/index.js"]
    }
  }
}
```

Restart Claude Desktop.

### Step 5: Test in Claude

Ask Claude:
```
Use web_search to find "latest AI news"
```

Should return results with sources!

## 🔧 Development Workflow

### Watch mode (auto-rebuild):
```bash
npm run dev
```

### Run tests:
```bash
npm test
```

### Lint code:
```bash
npm run lint
```

### Format code:
```bash
npm run format
```

## 📦 Publishing to npm

### 1. Update package.json

```json
{
  "name": "coexistai-mcp",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/SPThole/CoexistAI.git"
  }
}
```

### 2. Build

```bash
npm run build
```

### 3. Test locally

```bash
npm link
coexistai-mcp  # Should work
```

### 4. Publish

```bash
npm login
npm publish
```

### 5. Verify

```bash
npx coexistai-mcp@latest
```

## 🐛 Common Issues

### "Cannot find module"
```bash
npm install
npm run build
```

### "Docker not found"
```bash
# Start Docker Desktop
open -a Docker  # macOS
```

### "Port already in use"
```bash
# Kill process on port 8000
lsof -i :8000
kill -9 <PID>
```

### Backend not starting
```bash
cd ../
docker compose logs
docker compose restart
```

## 📝 Adding a New Tool

1. **Create tool file:**
```typescript
// src/tools/myTool.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

export function registerMyTool(server: McpServer, backend: BackendManager): void {
  server.registerTool(
    'my_tool',
    {
      title: 'My Tool',
      description: 'What it does',
      inputSchema: {
        param1: z.string().describe('Description'),
      },
    },
    async (args) => {
      try {
        logger.info(`🔧 My tool: ${args.param1}`);
        const response = await backend.makeRequest('/my-endpoint', args);
        return { content: [{ type: 'text', text: response }] };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${error}` }],
          isError: true,
        };
      }
    }
  );
}
```

2. **Register in index.ts:**
```typescript
// src/tools/index.ts
import { registerMyTool } from './myTool.js';

export function registerAllTools(server: McpServer, backend: BackendManager): void {
  // ... existing tools
  registerMyTool(server, backend);
}
```

3. **Rebuild:**
```bash
npm run build
```

## 🎯 Testing Checklist

Before publishing:

- [ ] All tools work in MCP Inspector
- [ ] Works in Claude Desktop
- [ ] Works in LM Studio
- [ ] Docker auto-starts correctly
- [ ] Health checks pass
- [ ] Error handling works
- [ ] Logs are clear
- [ ] README is accurate
- [ ] Version is correct
- [ ] No sensitive data in code

## 📚 Useful Commands

```bash
# Check what's running
docker ps

# View backend logs
docker compose logs -f app

# Restart backend
docker compose restart

# Stop everything
docker compose down

# Clean rebuild
rm -rf build node_modules
npm install
npm run build

# Test specific tool
npx @modelcontextprotocol/inspector node build/index.js
```

## 🎉 You're Ready!

The MCP server is production-ready. Just publish to npm and users can install with:

```bash
npm install -g coexistai-mcp
```

Or use directly:

```bash
npx coexistai-mcp
```

---

**Questions?** Check PROJECT_SUMMARY.md for architecture details.
