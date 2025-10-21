import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

export function registerWebSummarizeTool(server: McpServer, backend: BackendManager): void {
  server.registerTool(
    'web_summarize',
    {
      title: 'Web Summarize',
      description: 'Summarize any web page or local document based on a query or instruction',
      inputSchema: {
        query: z.string().describe('Instruction or question for the content'),
        url: z.string().describe('URL of the webpage or local file path'),
        local_mode: z.boolean().default(false).describe('Set to true if summarizing a local document'),
      },
    },
    async (args) => {
      try {
        logger.info(`📄 Summarizing: ${args.url}`);
        
        const response = await backend.makeRequest<string>('/web-summarize', args);

        return {
          content: [{ type: 'text', text: response }],
        };
      } catch (error) {
        logger.error('Summarization failed:', error);
        return {
          content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
          isError: true,
        };
      }
    }
  );
}
