import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { registerWebSearchTool } from './webSearch.js';
import { registerWebSummarizeTool } from './webSummarize.js';
import { registerYouTubeSearchTool } from './youtubeSearch.js';
import { registerRedditSearchTool } from './redditSearch.js';
import { registerMapSearchTool } from './mapSearch.js';
import { registerGitTreeTool } from './gitTree.js';
import { registerGitSearchTool } from './gitSearch.js';
import { registerLocalFolderTreeTool } from './localFolderTree.js';
import { registerResponseCheckTool } from './responseCheck.js';
import { registerClickableElementsTool } from './clickableElements.js';
import { registerPodcastTool } from './podcast.js';
import { registerBasicTTSTool } from './basicTTS.js';

export function registerAllTools(server: McpServer, backend: BackendManager): void {
  registerWebSearchTool(server, backend);
  registerWebSummarizeTool(server, backend);
  registerYouTubeSearchTool(server, backend);
  registerRedditSearchTool(server, backend);
  registerMapSearchTool(server, backend);
  registerGitTreeTool(server, backend);
  registerGitSearchTool(server, backend);
  registerLocalFolderTreeTool(server, backend);
  registerResponseCheckTool(server, backend);
  registerClickableElementsTool(server, backend);
  registerPodcastTool(server, backend);
  registerBasicTTSTool(server, backend);
}
