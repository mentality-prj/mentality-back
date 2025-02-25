import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

import { chatGPTmodel } from 'src/constants/openAI';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from 'src/constants/supported-languages.constant';
import { defaultPrompts } from 'src/constants/tips/prompts';
import { TipEntity } from 'src/tips/entities/tip.entity';
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

  // Generate a tip based on the given prompt and language
  async generateTip(
    prompt?: string,
    lang?: SupportedLanguage,
  ): Promise<TipEntity['translations']> {
    const prompts = { ...defaultPrompts };

    if (prompt && lang) {
      // Translate the given prompt to other supported languages
      const translations = await Promise.all(
        SUPPORTED_LANGUAGES.filter((language) => language !== lang).map(
          async (targetLang) => {
            const translationResponse =
              await this.openai.chat.completions.create({
                model: chatGPTmodel,
                messages: [
                  {
                    role: 'system',
                    content: `Translate the following to ${targetLang}:`,
                  },
                  { role: Roles.USER, content: prompt },
                ],
                max_tokens: 100,
              });
            return translationResponse.choices[0]?.message.content.trim() || '';
          },
        ),
      );

      // Add the original prompt to the prompts object
      prompts[`${lang}`] = prompt;
      // Add the translations to the prompts object
      SUPPORTED_LANGUAGES.filter((language) => language !== lang).forEach(
        (targetLang, index) => {
          prompts[`${targetLang}`] =
            translations[`${index}`] || defaultPrompts[`${targetLang}`];
        },
      );
    }

    // Generate tips for all supported languages
    const responses = await Promise.all(
      SUPPORTED_LANGUAGES.map(async (language) => {
        const tipResponse = await this.openai.chat.completions.create({
          model: chatGPTmodel,
          messages: [{ role: Roles.USER, content: prompts[`${language}`] }],
          max_tokens: 100,
        });
        return tipResponse.choices[0]?.message.content.trim() || '';
      }),
    );

    const translations: TipEntity['translations'] =
      {} as TipEntity['translations'];

    // Map the responses to the translations object
    SUPPORTED_LANGUAGES.forEach((language, index) => {
      translations[`${language}`] =
        responses[`${index}`] || 'No tip generated.';
    });

    return translations;
  }
}
