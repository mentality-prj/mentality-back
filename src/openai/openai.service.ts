import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

import { chatGPTmodel } from 'src/constants/openAI';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from 'src/constants/supported-languages.constant';
import { defaultPrompts } from 'src/constants/tips/prompts';
import { Roles } from 'src/users/schemas/user.schema';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

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

  async chat(message: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: chatGPTmodel,
      messages: [{ role: Roles.USER, content: message }],
    });
    return response.choices[0]?.message.content.trim() || 'No reply.';
  }

  async generateTip(
    prompt?: string,
    lang?: SupportedLanguage,
  ): Promise<{ [key: string]: string }> {
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

      prompts[`${lang}`] = prompt;
      SUPPORTED_LANGUAGES.filter((language) => language !== lang).forEach(
        (targetLang, index) => {
          prompts[`${targetLang}`] =
            translations[`${index}`] || defaultPrompts[`${targetLang}`];
        },
      );
    }

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

    const tips: { [key: string]: string } = {};
    SUPPORTED_LANGUAGES.forEach((language, index) => {
      tips[`${language}`] = responses[`${index}`] || 'No tip generated.';
    });

    return tips;
  }
}
