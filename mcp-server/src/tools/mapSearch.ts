import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

export function registerMapSearchTool(server: McpServer, backend: BackendManager): void {
  server.registerTool('map_search', {
    title: 'Map Search',
    description: 'Find locations, routes, and nearby points of interest',
    inputSchema: {
      start_location: z.string().optional().describe('Starting location'),
      end_location: z.string().optional().describe('Destination location'),
      pois_radius: z.number().default(500).describe('Search radius in meters for POIs'),
      amenities: z.string().default('restaurant|cafe|bar|hotel').describe('Amenities to search (pipe-separated)'),
      limit: z.number().default(3).describe('Max results if address not found'),
      task: z.enum(['location_only', 'route_and_pois']).default('route_and_pois'),
    },
  }, async (args) => {
    try {
      logger.info(`🗺️  Map search: ${args.start_location} → ${args.end_location}`);
      const response = await backend.makeRequest('/map-search', args);
      return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error: ${error}` }], isError: true };
    }
  });
}
