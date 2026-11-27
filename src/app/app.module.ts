import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from '../lib/prisma/prisma.module.js';
import { AppConfigModule } from '../config/config.module.js';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from '../lib/logger/logger.config.js';

@Module({
  imports: [AppConfigModule, PrismaModule, LoggerModule.forRoot(loggerConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
