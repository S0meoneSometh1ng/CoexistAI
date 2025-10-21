import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

export function registerClickableElementsTool(server: McpServer, backend: BackendManager): void {
  server.registerTool('clickable_elements', {
    title: 'Clickable Elements',
    description: 'Extract top-k clickable links from a webpage based on query',
    inputSchema: {
      url: z.string().describe('URL to extract links from'),
      query: z.string().describe('Query to filter relevant links'),
      topk: z.number().default(10).describe('Number of top links to return'),
    },
  }, async (args) => {
    try {
      logger.info(`🔗 Clickable elements: ${args.url}`);
      const response = await backend.makeRequest('/clickable-elements', args);
      return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error: ${error}` }], isError: true };
    }
  });
}
