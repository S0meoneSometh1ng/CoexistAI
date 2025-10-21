# CoexistAI MCP Server

Production-ready Model Context Protocol (MCP) server for CoexistAI - your AI research assistant with web search, YouTube, Reddit, maps, GitHub exploration, and more.

## ✨ Features

- 🔍 **Web Search** - AI-powered web search with source citations
- 📄 **Web Summarize** - Summarize any webpage or document
- 🎥 **YouTube** - Search and summarize videos
- 🔴 **Reddit** - Deep dive into Reddit discussions
- 🗺️ **Maps** - Find locations, routes, and POIs
- 🌳 **GitHub** - Explore and analyze code repositories
- 📁 **Local Files** - Search local documents with vision support
- 🎙️ **Podcast** - Convert text to multi-speaker podcasts
- 🔊 **TTS** - High-quality text-to-speech

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker Desktop (running)

### Installation

```bash
# Install globally
npm install -g coexistai-mcp

# Or use directly with npx
npx coexistai-mcp
```

### Configuration

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

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

#### LM Studio

Add to MCP settings:

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

#### Cursor / Cline

Add to `.cursorrules` or Cline MCP config:

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

## 🛠️ Tools

### web_search
Search the web and get AI-powered answers with sources.

**Parameters:**
- `query` (string) - Search query
- `rerank` (boolean) - Enable reranking (default: true)
- `num_results` (number) - Results per subquery 1-5 (default: 2)
- `local_mode` (boolean) - Search local documents (default: false)
- `document_paths` (string[]) - Local file paths when local_mode=true

**Example:**
```
Use web_search to find "latest AI research papers 2025"
```

### youtube_search
Search and summarize YouTube videos.

**Parameters:**
- `query` (string) - Video URL or search term
- `prompt` (string) - Processing instruction
- `n` (number) - Number of videos to summarize (default: 1)

**Example:**
```
Use youtube_search with query="machine learning tutorial" and prompt="Summarize key concepts"
```

### reddit_search
Search Reddit with custom filters.

**Parameters:**
- `search_query` (string) - Search phrase
- `subreddit` (string) - Subreddit name
- `n` (number) - Number of posts (default: 3)
- `k` (number) - Comments per post (default: 1)
- `time_filter` (enum) - all, day, week, month, year
- `sort_type` (enum) - relevance, hot, top, new

### map_search
Find locations, routes, and nearby POIs.

**Parameters:**
- `start_location` (string) - Starting point
- `end_location` (string) - Destination
- `pois_radius` (number) - Search radius in meters (default: 500)
- `amenities` (string) - Types: restaurant|cafe|bar|hotel
- `task` (enum) - location_only or route_and_pois

### git_tree
Get repository directory structure.

**Parameters:**
- `repobaseurl` (string) - GitHub URL or local path

### git_search
Search and analyze code in repositories.

**Parameters:**
- `repobaseurl` (string) - Repository URL/path
- `parttoresearch` (string) - File/folder path
- `query` (string) - Question about the code
- `type` (enum) - file or folder

### local_folder_tree
Explore local folder structure.

**Parameters:**
- `folder_path` (string) - Local folder path
- `level` (enum) - full, broad-first, broad-second

### text_to_podcast
Convert text to multi-speaker podcast.

**Parameters:**
- `text` (string) - Content to convert
- `prompt` (string) - Theme/tone instructions

### basic_tts
Convert text to speech.

**Parameters:**
- `text` (string) - Text to speak
- `voice` (enum) - Voice selection (10 voices available)
- `lang` (string) - Language code (default: en-us)

## 🔧 Advanced Configuration

### Environment Variables

Create `.env` file:

```bash
# FastAPI backend URL
FASTAPI_URL=http://localhost:8000

# Backend path (auto-detected)
BACKEND_PATH=./backend

# Request timeout (ms)
REQUEST_TIMEOUT=180000

# Log level
LOG_LEVEL=info
```

### Custom Backend

If running backend separately:

```bash
# Start backend manually
cd backend
docker compose up -d

# Run MCP server
FASTAPI_URL=http://localhost:8000 npx coexistai-mcp
```

## 🐳 Docker Deployment

The server automatically manages Docker containers for:
- **SearxNG** - Privacy-focused meta-search engine
- **FastAPI** - Python backend with all AI capabilities

Containers start automatically on first run and persist across sessions.

## 📊 Monitoring

Check backend status:
```bash
curl http://localhost:8000/status
```

View logs:
```bash
docker compose logs -f
```

## 🔍 Troubleshooting

### Docker not found
```bash
# Install Docker Desktop
# https://www.docker.com/products/docker-desktop
```

### Services not starting
```bash
# Check Docker is running
docker ps

# Restart services
cd backend
docker compose restart
```

### Port conflicts
```bash
# Change ports in backend/.env
PORT_NUM_APP=8001
PORT_NUM_SEARXNG=8086
```

## 🤝 Contributing

Issues and PRs welcome at [github.com/SPThole/CoexistAI](https://github.com/SPThole/CoexistAI)

## 📄 License

MIT License - See LICENSE file

## 🌟 Credits

Built on top of:
- [Model Context Protocol](https://modelcontextprotocol.io)
- [LangChain](https://langchain.com)
- [SearxNG](https://github.com/searxng/searxng)
