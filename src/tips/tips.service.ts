import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from 'src/constants/supported-languages.constant';
import { defaultPrompts } from 'src/constants/tips/prompts';
import { HuggingFaceService } from 'src/huggingface/huggingface.service';
// import { OpenaiService } from 'src/openai/openai.service';

import { GenerateTipDto, UpdateTipDto } from './dtos';
import { TipEntity } from './entities/tip.entity';
import { TipsMapper } from './helpers/tips.mapper';
import { Tip } from './schemas/tip.schema';

@Injectable()
export class TipsService {
  constructor(
    @InjectModel('Tip') private tipModel: Model<Tip>,
    // private readonly openaiService: OpenaiService,
    private readonly huggingFaceService: HuggingFaceService,
  ) {}

  // async generateTip(generateTipDto: GenerateTipDto): Promise<TipEntity> {
  //   const { prompt, lang } = generateTipDto;

  //   const content = await this.openaiService.generateTip(prompt, lang);
  //   const tip = new this.tipModel({ content });
  //   await tip.save();
  //   return TipsMapper.toTipEntity(tip);
  // }

  async generateTip(generateTipDto: GenerateTipDto): Promise<TipEntity> {
    const { prompt, lang } = generateTipDto;
    const _prompt = prompt || defaultPrompts[`${lang}`];

    try {
      // Генерація контенту на основі промпту
      const content = await this.huggingFaceService.generateText(_prompt);

      console.log('_prompt: ', _prompt);
      console.log('generate: ', content);

      // Переклад контенту на необхідну мову
      const translations = await Promise.all(
        SUPPORTED_LANGUAGES.map(async (targetLang: SupportedLanguage) => {
          const translatedContent =
            lang === targetLang
              ? content // Якщо мова вже відповідна, не перекладаємо
              : await this.huggingFaceService.translateText(
                  content,
                  targetLang,
                );
          return { [targetLang]: translatedContent };
        }),
      );

      // Об'єднуємо всі переклади в єдиний об'єкт
      const translationsMap = translations.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {},
      );

      console.log('translationsMap', translationsMap);

      // Зберігаємо новий Tip у базу даних
      const tip = new this.tipModel({
        translations: translationsMap,
        createdAt: new Date(),
      });
      console.log('-------------------------------tip', tip);
      await tip.save();

      // Перетворення в формат TipEntity
      return TipsMapper.toTipEntity(tip);
    } catch (error) {
      console.error('Error generating tip:', error);

      // Обробка помилок: кидаємо зрозуміле виключення
      throw new Error('Failed to generate tip. Please try again later.');
    }
  }

  async getManyTipsWithPagination(
    page: number,
    limit: number,
  ): Promise<{ data: TipEntity[]; total: number }> {
    const skip = (page - 1) * limit;

    const [tips, total] = await Promise.all([
      this.tipModel.find().skip(skip).limit(limit).exec(),
      this.tipModel.countDocuments().exec(),
    ]);
    const data = tips.map(TipsMapper.toTipEntity);

    return { data, total };
  }

  async getAllUnpublishedTips(): Promise<TipEntity[]> {
    const unpublishedTips = await this.tipModel
      .find({ isPublished: false })
      .sort({ createdAt: -1 })
      .exec();

    return unpublishedTips.map(TipsMapper.toTipEntity);
  }

  async updateTip(id: string, updateTipDto: UpdateTipDto): Promise<TipEntity> {
    const { translations, isPublished } = updateTipDto;

    const updatedTip = await this.tipModel
      .findByIdAndUpdate(
        id,
        { translations, updatedAt: new Date(), isPublished },
        { new: true },
      )
      .exec();

    if (!updatedTip) {
      throw new NotFoundException('Tip not found');
    }

    return TipsMapper.toTipEntity(updatedTip);
  }

  async deleteTipById(id: string): Promise<boolean> {
    const result = await this.tipModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return false;
    }

    return true;
  }
}
