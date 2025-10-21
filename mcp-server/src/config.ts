import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenvConfig();

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface Config {
  fastapiUrl: string;
  backendPath: string;
  requestTimeout: number;
  logLevel: string;
}

export const config: Config = {
  fastapiUrl: process.env.FASTAPI_URL || 'http://localhost:8000',
  backendPath: process.env.BACKEND_PATH || resolve(__dirname, '../../backend'),
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '180000', 10), // 3 minutes
  logLevel: process.env.LOG_LEVEL || 'info',
};
