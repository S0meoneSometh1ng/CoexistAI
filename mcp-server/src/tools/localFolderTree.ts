import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

export function registerLocalFolderTreeTool(server: McpServer, backend: BackendManager): void {
  server.registerTool('local_folder_tree', {
    title: 'Local Folder Tree',
    description: 'Explore local folder structure with vision support for images',
    inputSchema: {
      folder_path: z.string().describe('Path to local folder'),
      level: z.enum(['full', 'broad-first', 'broad-second']).default('broad-first').describe('Tree depth level'),
      prefix: z.string().default('').describe('Internal indentation prefix'),
    },
  }, async (args) => {
    try {
      logger.info(`📁 Folder tree: ${args.folder_path}`);
      const response = await backend.makeRequest<string>('/local-folder-tree', args);
      return { content: [{ type: 'text', text: response }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error: ${error}` }], isError: true };
    }
  });
}
