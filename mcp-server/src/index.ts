#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { BackendManager } from './backend/manager.js';
import { logger } from './utils/logger.js';
import { registerAllTools } from './tools/index.js';
import { config } from './config.js';

async function main() {
  try {
    // Initialize backend manager
    const backend = new BackendManager(config);
    
    // Create MCP server
    const server = new McpServer({
      name: 'coexistai',
      version: '1.0.0',
    });

    // Register all tools
    registerAllTools(server, backend);

    // Connect to stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    // Graceful shutdown
    process.on('SIGINT', () => process.exit(0));
    process.on('SIGTERM', () => process.exit(0));

  } catch (error) {
    process.stderr.write(`Failed to start: ${error}\n`);
    process.exit(1);
  }
}

main();
