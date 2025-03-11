import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { DEFAULT_DELAY, LONG_DELAY } from 'src/constants';
import { generateModel, translateModelMap } from 'src/constants/huggingface';
import { SupportedLanguage } from 'src/constants/supported-languages.constant';

@Injectable()
export class HuggingFaceService {
  private readonly baseUrl = 'https://api-inference.huggingface.co/models';
  private readonly token = process.env.HUGGING_FACE_TOKEN;

  constructor(private readonly httpService: HttpService) {}

  // Text generation
  async generateText(prompt: string): Promise<string> {
    const model = generateModel; // Model for generation
    const headers = { Authorization: `Bearer ${this.token}` };
    const body = {
      inputs: prompt,
      options: {
        max_length: 100, // Maximum response length
        temperature: 0.7, // Randomness regulation
      },
    };

    const maxRetries = 5; // Maximum number of attempts
    const retryDelay = LONG_DELAY; // Delay between attempts in ms (5 seconds)
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await lastValueFrom(
          this.httpService.post(`${this.baseUrl}/${model}`, body, { headers }),
        );

        // Check if generated text is in the response
        if (response.data && response.data[0]?.generated_text) {
          return response.data[0].generated_text;
        }

        return 'No content generated.';
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;

        if (
          error.response?.status === HttpStatus.SERVICE_UNAVAILABLE ||
          errorMessage.includes('currently loading')
        ) {
          console.log(
            `Model ${model} is currently loading. Retrying in ${
              retryDelay / DEFAULT_DELAY
            } seconds...`,
          );
          attempt++;
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          console.error('Error during text generation:', errorMessage);
          throw new Error(`Failed to generate text: ${errorMessage}`);
        }
      }
    }

    throw new Error(
      `Model ${model} is still loading after ${maxRetries} attempts.`,
    );
  }

  // Text translation
  async translateText(
    text: string,
    targetLang: SupportedLanguage,
  ): Promise<string> {
    const modelMap = translateModelMap;

    const model = modelMap[`${targetLang}`];
    const headers = { Authorization: `Bearer ${this.token}` };
    const body = { inputs: text };

    const maxRetries = 5; // Maximum number of retry attempts
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await lastValueFrom(
          this.httpService.post(`${this.baseUrl}/${model}`, body, { headers }),
        );

        if (response.data && response.data[0]?.translation_text) {
          return response.data[0].translation_text;
        }

        return 'No translation generated.';
      } catch (error) {
        if (
          error.response?.status === HttpStatus.SERVICE_UNAVAILABLE ||
          error.response?.data?.error?.includes('currently loading')
        ) {
          // Logging if the model is still loading
          console.log(
            `Model ${model} is currently loading, retrying in 5 seconds...`,
          );
          await new Promise((resolve) => setTimeout(resolve, LONG_DELAY)); // Waiting before retrying
          attempt++;
        } else {
          // Throw other errors
          console.error(
            'Error during translation:',
            error.response?.data || error,
          );
          throw new Error(
            `Failed to translate text to ${targetLang}: ${
              error.response?.data?.error || error.message
            }`,
          );
        }
      }
    }

    // If all attempts are exhausted
    throw new Error(
      `Failed to translate text to ${targetLang} after ${maxRetries} attempts.`,
    );
  }
}
