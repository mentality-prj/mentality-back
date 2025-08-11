import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

import { chatGPTmodel } from 'src/constants/openAI';
import { Roles } from 'src/users/schemas/user.schema';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    // Initialize OpenAI with the API key from environment variables
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Generate an article based on the given prompt
  async generateArticle(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: chatGPTmodel,
      messages: [{ role: Roles.USER, content: prompt }],
      max_tokens: 500,
    });
    return (
      response.choices[0]?.message.content.trim() || 'No content generated.'
    );
  }

  // Chat with the model using the given message
  async chat(message: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: chatGPTmodel,
      messages: [{ role: Roles.USER, content: message }],
    });
    return response.choices[0]?.message.content.trim() || 'No reply.';
  }

  // Generate a tip based on the given prompt
  async generateTip(prompt: string): Promise<string> {
    try {
      const tipResponse = await this.openai.chat.completions.create({
        model: chatGPTmodel,
        messages: [{ role: Roles.USER, content: prompt }],
        max_tokens: 300,
      });
      const tip = tipResponse.choices[0]?.message.content.trim() || '';
      console.log(`Generated tip: ${tip}`);
      return tip;
    } catch (error) {
      console.error(`Error generating tip:`, error);
      return 'No tip generated.';
    }
  }

  // Generate an affirmation based on the given prompt
  async generateAffirmation(prompt: string): Promise<string> {
    try {
      const affirmationResponse = await this.openai.chat.completions.create({
        model: chatGPTmodel,
        messages: [{ role: Roles.USER, content: prompt }],
        max_tokens: 100,
      });
      const affirmation =
        affirmationResponse.choices[0]?.message.content.trim() || '';
      console.log(`Generated affirmation: ${affirmation}`);
      return affirmation;
    } catch (error) {
      console.error(`Error generating affirmation:`, error);
      return 'No affirmation generated.';
    }
  }

  // Generate an image using OpenAI's image generation API
  async generateImage(prompt: string): Promise<string> {
    try {
      // If using OpenAI's DALL·E API
      const response = await this.openai.images.generate({
        prompt,
        n: 1,
        size: '1024x1024',
      });
      const imageUrl = response.data[0]?.url || '';
      console.log(`Generated image URL: ${imageUrl}`);
      return imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      return '';
    }
  }
}
