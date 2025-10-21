import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

export function registerYouTubeSearchTool(server: McpServer, backend: BackendManager): void {
  server.registerTool(
    'youtube_search',
    {
      title: 'YouTube Search',
      description: 'Search and summarize YouTube videos by keyword or URL',
      inputSchema: {
        query: z.string().describe('YouTube video URL or search term'),
        prompt: z.string().describe('Instruction for processing the video content'),
        n: z.number().min(1).max(10).default(1).describe('Number of videos to summarize (only for search terms)'),
      },
    },
    async (args) => {
      try {
        logger.info(`🎥 YouTube search: ${args.query}`);
        const response = await backend.makeRequest<string>('/youtube-search', args);
        return { content: [{ type: 'text', text: response }] };
      } catch (error) {
        logger.error('YouTube search failed:', error);
        return {
          content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
          isError: true,
        };
      }
    }
  );
}
