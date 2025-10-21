import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

export function registerGitSearchTool(server: McpServer, backend: BackendManager): void {
  server.registerTool('git_search', {
    title: 'Git Search',
    description: 'Search and analyze code in GitHub or local repositories',
    inputSchema: {
      repobaseurl: z.string().describe('GitHub URL or local repository path'),
      parttoresearch: z.string().describe('Folder or file path relative to repo root'),
      query: z.string().describe('Question or instruction for the code'),
      type: z.enum(['file', 'folder']).describe('Whether searching a file or folder'),
    },
  }, async (args) => {
    try {
      logger.info(`🔍 Git search: ${args.parttoresearch}`);
      const response = await backend.makeRequest<string>('/git-search', args);
      return { content: [{ type: 'text', text: response }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error: ${error}` }], isError: true };
    }
  });
}
