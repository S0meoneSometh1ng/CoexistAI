import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

export function registerWebSearchTool(server: McpServer, backend: BackendManager): void {
  server.registerTool(
    'web_search',
    {
      title: 'Web Search',
      description: 'Search the web and get AI-powered answers with sources. Supports both web search and local document analysis.',
      inputSchema: {
        query: z.string().describe('The search query or question to answer'),
        rerank: z.boolean().default(true).describe('Enable result reranking for better quality'),
        num_results: z.number().min(1).max(5).default(2).describe('Number of top results per subquery (1-5)'),
        local_mode: z.boolean().default(false).describe('Set to true to search local documents instead of web'),
        split: z.boolean().default(true).describe('Split documents into chunks for better processing'),
        document_paths: z.array(z.string()).default([]).describe('List of local document/folder paths when local_mode is true'),
      },
      outputSchema: {
        result: z.string(),
        sources: z.string(),
      },
    },
    async (args) => {
      try {
        logger.info(`🔍 Web search: ${args.query}`);
        
        const response = await backend.makeRequest<string>('/web-search', {
          query: args.query,
          rerank: args.rerank,
          num_results: args.num_results,
          local_mode: args.local_mode,
          split: args.split,
          document_paths: args.document_paths,
        });

        return {
          content: [
            {
              type: 'text',
              text: response,
            },
          ],
        };
      } catch (error) {
        logger.error('Web search failed:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
