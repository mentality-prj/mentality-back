import { Injectable } from '@nestjs/common';

import {
  SUPPORTED_LANGUAGES_KEYS,
  SupportedLanguages,
} from 'src/constants/supported-languages.constant';
import { HuggingFaceService } from 'src/huggingface/huggingface.service';
import { TipEntity } from 'src/tips/entities/tip.entity';

@Injectable()
export class TranslationsService {
  constructor(private readonly huggingFaceService: HuggingFaceService) {}

  // Generate translations for the content
  async getTranslations(
    content: string,
    lang: SupportedLanguages,
  ): Promise<TipEntity['translations']> {
    const translations: TipEntity['translations'] =
      {} as TipEntity['translations'];

    await Promise.all(
      SUPPORTED_LANGUAGES_KEYS.map(async (targetLang: SupportedLanguages) => {
        const translatedContent =
          lang === targetLang
            ? content
            : await this.huggingFaceService.translateText(content, targetLang);
        translations[`${targetLang}`] = translatedContent;
      }),
    );

    return translations;
  }
}
