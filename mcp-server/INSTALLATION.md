# CoexistAI MCP Server - Installation Guide

## 📋 Prerequisites

Before installing, ensure you have:

1. **Node.js 18+**
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```
   Download from: https://nodejs.org

2. **Docker Desktop** (running)
   ```bash
   docker --version
   docker ps  # Should not error
   ```
   Download from: https://www.docker.com/products/docker-desktop

3. **Git** (for development)
   ```bash
   git --version
   ```

## 🚀 Installation Methods

### Method 1: NPM Global Install (Recommended for Users)

```bash
# Install globally
npm install -g coexistai-mcp

# Run anywhere
coexistai-mcp
```

### Method 2: NPX (No Installation)

```bash
# Run directly without installing
npx coexistai-mcp
```

This is perfect for trying it out or using in MCP configs.

### Method 3: Local Development

```bash
# Clone repository
git clone https://github.com/SPThole/CoexistAI.git
cd CoexistAI/mcp-server

# Run setup script
./setup-backend.sh

# Start server
npm start
```

## 🔧 Configuration

### Step 1: Configure MCP Client

#### For Claude Desktop

**macOS:**
```bash
# Edit config
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```bash
# Edit config
notepad %APPDATA%\Claude\claude_desktop_config.json
```

**Add this:**
```json
{
  "mcpServers": {
    "coexistai": {
      "command": "npx",
      "args": ["-y", "coexistai-mcp"],
      "env": {
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

#### For LM Studio

1. Open LM Studio
2. Go to **Developer** → **MCP Servers**
3. Click **Add Server**
4. Add:
   ```json
   {
     "coexistai": {
       "command": "npx",
       "args": ["-y", "coexistai-mcp"]
     }
   }
   ```

#### For Cursor

Add to `.cursorrules` or MCP settings:
```json
{
  "mcpServers": {
    "coexistai": {
      "command": "npx",
      "args": ["-y", "coexistai-mcp"]
    }
  }
}
```

### Step 2: First Run

The first time you run the server:

1. **Docker images will download** (~2-3 minutes)
   - SearxNG search engine
   - Python FastAPI backend

2. **Services will start automatically**
   - SearxNG on port 8085
   - FastAPI on port 8000

3. **Health checks will run** (~30 seconds)
   - Waiting for services to be ready

4. **Server becomes available**
   - MCP tools are now accessible

**Subsequent runs are instant** (containers already exist).

## 🔍 Verification

### Check if it's working:

1. **Check Docker containers:**
   ```bash
   docker ps
   ```
   You should see:
   - `coexistai-app`
   - `coexistai-searxng`

2. **Check FastAPI:**
   ```bash
   curl http://localhost:8000/status
   ```
   Should return: `{"status":"ready"}`

3. **Check SearxNG:**
   ```bash
   curl http://localhost:8085
   ```
   Should return HTML

4. **Test in Claude/LM Studio:**
   - Ask: "Use web_search to find latest AI news"
   - Should return results with sources

## 🐛 Troubleshooting

### Issue: "Docker not found"

**Solution:**
1. Install Docker Desktop
2. Start Docker Desktop
3. Wait for it to fully start (whale icon in system tray)
4. Try again

### Issue: "Port already in use"

**Solution:**
```bash
# Check what's using the port
lsof -i :8000  # or :8085

# Stop conflicting service or change ports
# Edit backend/.env:
PORT_NUM_APP=8001
PORT_NUM_SEARXNG=8086
```

### Issue: "Services not starting"

**Solution:**
```bash
# Check Docker logs
cd backend
docker compose logs

# Restart services
docker compose restart

# Or full reset
docker compose down
docker compose up -d
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
npm install

# Rebuild
npm run build
```

### Issue: "Permission denied"

**Solution:**
```bash
# macOS/Linux: Fix permissions
chmod +x setup-backend.sh
chmod +x build/index.js

# Or run with sudo (not recommended)
sudo npm install -g coexistai-mcp
```

## 🔐 API Keys (Optional)

If using cloud LLM models (Google Gemini, OpenAI, etc.):

1. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your keys:**
   ```bash
   GOOGLE_API_KEY=your_key_here
   OPENAI_API_KEY=your_key_here
   GROQ_API_KEY=your_key_here
   ```

3. **Or set in MCP config:**
   ```json
   {
     "mcpServers": {
       "coexistai": {
         "command": "npx",
         "args": ["-y", "coexistai-mcp"],
         "env": {
           "GOOGLE_API_KEY": "your_key_here"
         }
       }
     }
   }
   ```

## 📊 Monitoring

### View logs:

```bash
# MCP server logs (stdout)
# Automatically shown in Claude/LM Studio console

# Backend logs
docker compose logs -f app

# SearxNG logs
docker compose logs -f searxng
```

### Check resource usage:

```bash
docker stats
```

## 🔄 Updating

### Update to latest version:

```bash
# If installed globally
npm update -g coexistai-mcp

# If using npx (automatic)
npx coexistai-mcp  # Always uses latest

# If local development
git pull
npm install
npm run build
```

## 🗑️ Uninstallation

### Remove everything:

```bash
# Stop and remove containers
cd backend
docker compose down -v

# Remove npm package
npm uninstall -g coexistai-mcp

# Remove Docker images (optional)
docker rmi searxng/searxng
docker rmi coexistai-app
```

## 💡 Tips

1. **First run takes time** - Docker downloads ~500MB of images
2. **Keep Docker running** - Server won't work without it
3. **Use npx for testing** - No installation needed
4. **Check logs first** - Most issues show up in logs
5. **Restart fixes most issues** - `docker compose restart`

## 📚 Next Steps

- Read [README.md](README.md) for tool documentation
- Check [examples/](examples/) for usage patterns
- Join discussions on GitHub

## 🆘 Getting Help

- **GitHub Issues**: https://github.com/SPThole/CoexistAI/issues
- **Discussions**: https://github.com/SPThole/CoexistAI/discussions
- **Discord**: [Coming soon]

---

**Happy researching! 🚀**
