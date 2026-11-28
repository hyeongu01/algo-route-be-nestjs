import { Module } from '@nestjs/common';
import { AiModule } from '@nestjs/ai';
import { anthropic } from '@ai-sdk/anthropic';

@Module({
  imports: [
    AiModule.forRoot({
      models: {
        default: anthropic('claude-haiku-5-5'),
        main: {
          model: anthropic('claude-sonnet-5-5'),
          fallback: 'default',
        },
        heavy: {
          model: anthropic('claude-opus-5-5'),
          fallback: 'default',
        },
        dev: anthropic('claude-haiku-5-5'),
      },
    }),
  ],
})
export class LlmModule {}
