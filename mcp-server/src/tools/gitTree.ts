import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

export function registerGitTreeTool(server: McpServer, backend: BackendManager): void {
  server.registerTool('git_tree', {
    title: 'Git Repository Tree',
    description: 'Get directory structure of GitHub or local repository',
    inputSchema: {
      repobaseurl: z.string().describe('GitHub URL or local repository path'),
    },
  }, async (args) => {
    try {
      logger.info(`🌳 Git tree: ${args.repobaseurl}`);
      const response = await backend.makeRequest<string>('/git-tree-search', args);
      return { content: [{ type: 'text', text: response }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error: ${error}` }], isError: true };
    }
  });
}
