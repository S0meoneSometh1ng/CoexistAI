#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { BackendManager } from './backend/manager.js';
import { logger } from './utils/logger.js';
import { registerAllTools } from './tools/index.js';
import { config } from './config.js';

async function main() {
  try {
    logger.info('🚀 Starting CoexistAI MCP Server...');

    // Initialize backend manager
    const backend = new BackendManager(config);
    
    // Start backend services (Docker + FastAPI)
    await backend.start();

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

    logger.info('✅ CoexistAI MCP Server ready');

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('🛑 Shutting down...');
      await backend.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('🛑 Shutting down...');
      await backend.stop();
      process.exit(0);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

main();
