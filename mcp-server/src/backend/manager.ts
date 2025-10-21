import { execa } from 'execa';
import axios from 'axios';
import pRetry from 'p-retry';
import { logger } from '../utils/logger.js';
import type { Config } from '../config.js';

export class BackendManager {
  private config: Config;
  private isRunning = false;

  constructor(config: Config) {
    this.config = config;
  }

  async start(): Promise<void> {
    logger.info('🐳 Starting backend services...');

    // Check if Docker is available
    await this.checkDocker();

    // Start Docker Compose
    await this.startDockerCompose();

    // Wait for services to be healthy
    await this.waitForHealth();

    this.isRunning = true;
    logger.info('✅ Backend services ready');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;

    logger.info('🛑 Stopping backend services...');
    try {
      await execa('docker', ['compose', 'down'], {
        cwd: this.config.backendPath,
      });
      this.isRunning = false;
      logger.info('✅ Backend services stopped');
    } catch (error) {
      logger.error('Failed to stop backend:', error);
    }
  }

  private async checkDocker(): Promise<void> {
    try {
      await execa('docker', ['--version']);
      logger.info('✅ Docker is available');
    } catch {
      throw new Error('Docker is not installed or not running. Please install Docker Desktop.');
    }
  }

  private async startDockerCompose(): Promise<void> {
    try {
      // Check if already running
      const { stdout } = await execa('docker', ['compose', 'ps', '-q'], {
        cwd: this.config.backendPath,
      });

      if (stdout.trim()) {
        logger.info('ℹ️  Backend services already running');
        return;
      }

      // Start services
      logger.info('🚀 Starting Docker Compose...');
      await execa('docker', ['compose', 'up', '-d'], {
        cwd: this.config.backendPath,
        stdio: 'inherit',
      });

      logger.info('✅ Docker Compose started');
    } catch (error) {
      throw new Error(`Failed to start Docker Compose: ${error}`);
    }
  }

  private async waitForHealth(): Promise<void> {
    logger.info('⏳ Waiting for services to be healthy...');

    await pRetry(
      async () => {
        const response = await axios.get(`${this.config.fastapiUrl}/status`, {
          timeout: 5000,
        });

        if (response.data.status !== 'ready') {
          throw new Error('Services not ready yet');
        }
      },
      {
        retries: 30,
        minTimeout: 2000,
        maxTimeout: 5000,
        onFailedAttempt: (error) => {
          logger.info(`Attempt ${error.attemptNumber} failed. Retrying...`);
        },
      }
    );

    logger.info('✅ All services healthy');
  }

  async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await axios.post(`${this.config.fastapiUrl}${endpoint}`, data, {
        timeout: this.config.requestTimeout,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Backend request failed: ${error.message}`);
      }
      throw error;
    }
  }
}
