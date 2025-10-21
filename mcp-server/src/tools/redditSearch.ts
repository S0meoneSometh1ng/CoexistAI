import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

export function registerRedditSearchTool(server: McpServer, backend: BackendManager): void {
  server.registerTool('reddit_search', {
    title: 'Reddit Search',
    description: 'Search Reddit posts and comments with custom filters',
    inputSchema: {
      subreddit: z.string().default('').describe('Subreddit name (leave empty for search)'),
      url_type: z.enum(['search', 'hot', 'top', 'new', 'best', 'controversial', 'rising']).default('search'),
      n: z.number().min(1).max(20).default(3).describe('Number of posts to fetch'),
      k: z.number().min(1).max(10).default(1).describe('Number of top comments per post'),
      custom_url: z.string().optional().describe('Direct Reddit URL'),
      time_filter: z.enum(['all', 'day', 'week', 'month', 'year']).default('all'),
      search_query: z.string().default('').describe('Search phrase'),
      sort_type: z.enum(['relevance', 'hot', 'top', 'new']).default('relevance'),
    },
  }, async (args) => {
    try {
      logger.info(`🔴 Reddit search: ${args.search_query || args.subreddit}`);
      const response = await backend.makeRequest<string>('/reddit-search', args);
      return { content: [{ type: 'text', text: response }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error: ${error}` }], isError: true };
    }
  });
}
