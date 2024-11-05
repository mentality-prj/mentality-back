import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateArticle(prompt: string): Promise<string> {
    const response = await this.openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 500,
    });
    return response.choices[0]?.text.trim() || 'No content generated.';
  }

  async chat(message: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });
    return response.choices[0]?.message.content.trim() || 'No reply.';
  }
}
