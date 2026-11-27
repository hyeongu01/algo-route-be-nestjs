import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from './generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { dbConfig } from '../../config/namespace/db.config.js';
import { type ConfigType } from '@nestjs/config';
import { readFileSync } from 'node:fs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly dbUrl: URL;
  constructor(
    @Inject(dbConfig.KEY) config: ConfigType<typeof dbConfig>,
    @InjectPinoLogger(PrismaService.name) private readonly logger: PinoLogger,
  ) {
    const adapter = new PrismaPg({
      connectionString: config.url,
      ssl: {
        ...(config.caPath && { ca: readFileSync(config.caPath, 'utf-8') }),
      },
    });
    super({ adapter });
    this.dbUrl = new URL(config.url);
  }

  async onModuleInit() {
    await this.$connect();
    this.$queryRaw`SELECT 1`;
    this.logger.info(
      {
        host: this.dbUrl.host,
        port: this.dbUrl.port,
        username: this.dbUrl.username,
      },
      `DB Connected on ${this.dbUrl.host}:${this.dbUrl.port}`,
    );
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
