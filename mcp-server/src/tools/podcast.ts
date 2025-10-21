import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

export function registerPodcastTool(server: McpServer, backend: BackendManager): void {
  server.registerTool('text_to_podcast', {
    title: 'Text to Podcast',
    description: 'Convert text into an engaging multi-speaker podcast episode',
    inputSchema: {
      text: z.string().describe('Content to convert into podcast'),
      prompt: z.string().optional().describe('Theme, tone, or length instructions'),
    },
  }, async (args) => {
    try {
      logger.info(`🎙️  Creating podcast...`);
      const response = await backend.makeRequest<string>('/text-to-podcast', args);
      return { content: [{ type: 'text', text: response }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error: ${error}` }], isError: true };
    }
  });
}
