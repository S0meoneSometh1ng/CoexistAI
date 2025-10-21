import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BackendManager } from '../backend/manager.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

export function registerBasicTTSTool(server: McpServer, backend: BackendManager): void {
  server.registerTool('basic_tts', {
    title: 'Basic Text-to-Speech',
    description: 'Convert text to speech with voice selection',
    inputSchema: {
      text: z.string().describe('Text to convert to speech'),
      voice: z.enum(['af_heart', 'am_michael', 'am_adam', 'am_eric', 'am_echo', 'am_puck', 'am_fenrir', 'am_santa', 'am_liam', 'af_river']).default('am_santa'),
      lang: z.string().default('en-us').describe('Language code'),
      filename: z.string().default('').describe('Output filename (optional)'),
    },
  }, async (args) => {
    try {
      logger.info(`🔊 TTS: ${args.text.substring(0, 50)}...`);
      const response = await backend.makeRequest<string>('/basic-tts', args);
      return { content: [{ type: 'text', text: response }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error: ${error}` }], isError: true };
    }
  });
}
