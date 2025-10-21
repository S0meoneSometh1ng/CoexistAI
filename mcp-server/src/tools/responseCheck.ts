import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

export function registerResponseCheckTool(server: McpServer, backend: BackendManager): void {
  server.registerTool('response_check', {
    title: 'Response Check',
    description: 'Verify if collected information is complete for answering the query',
    inputSchema: {
      query: z.string().describe('Original user query'),
      toolsshorthand: z.string().describe('Facts/information collected from tool usage'),
    },
  }, async (args) => {
    try {
      logger.info(`✅ Response check for: ${args.query}`);
      const response = await backend.makeRequest<string>('/check-response', args);
      return { content: [{ type: 'text', text: response }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error: ${error}` }], isError: true };
    }
  });
}
