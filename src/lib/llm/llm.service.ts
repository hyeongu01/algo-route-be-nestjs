import { Injectable } from '@nestjs/common';
import { AiService } from '@nestjs/ai';

@Injectable()
export class LlmService {
  constructor(private readonly aiService: AiService) {}

  async test(): Promise<string> {
    const { text } = await this.aiService.generateText({
      model: 'dev',
      label: 'draft-reply',
      instructions: 'reply test',
      prompt: 'sdfs',
      maxOutputTokens: 400,
    });
    return text;
  }
}
