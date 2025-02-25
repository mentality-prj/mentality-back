import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from 'src/constants/supported-languages.constant';
import { defaultPrompts } from 'src/constants/tips/prompts';
import { HuggingFaceService } from 'src/huggingface/huggingface.service';
import { OpenaiService } from 'src/openai/openai.service';

import { GenerateTipDto, UpdateTipDto } from './dtos';
import { TipEntity } from './entities/tip.entity';
import { TipsMapper } from './helpers/tips.mapper';
import { Tip } from './schemas/tip.schema';

@Injectable()
export class TipsService {
  constructor(
    @InjectModel('Tip') private tipModel: Model<Tip>,
    private readonly openaiService: OpenaiService,
    private readonly huggingFaceService: HuggingFaceService,
  ) {}

  // Generate translations for the content
  async getTranslations(
    content: string,
    lang: SupportedLanguage,
  ): Promise<TipEntity['translations']> {
    // Translate content to the required language
    const translations: TipEntity['translations'] =
      {} as TipEntity['translations'];

    await Promise.all(
      SUPPORTED_LANGUAGES.map(async (targetLang: SupportedLanguage) => {
        const translatedContent =
          lang === targetLang
            ? content // If the language is already correct, do not translate
            : await this.huggingFaceService.translateText(content, targetLang);
        translations[`${targetLang}`] = translatedContent;
      }),
    );

    return translations;
  }

  // Save the new Tip to the database
  async saveTip(translations: TipEntity['translations']): Promise<TipEntity> {
    const newTip = new this.tipModel({
      translations: translations,
      createdAt: new Date(),
    });
    await newTip.save();

    // Convert to TipEntity format
    return TipsMapper.toTipEntity(newTip);
  }

  // Generate a tip using the specified service
  async generateTip(
    generateTipDto: GenerateTipDto,
    service: 'openai' | 'huggingface',
  ): Promise<TipEntity> {
    const { prompt, lang } = generateTipDto;
    const _prompt = prompt || defaultPrompts[`${lang}`];

    if (service === 'openai') {
      return this.generateTipWithOpenAI({ prompt: _prompt, lang });
    } else if (service === 'huggingface') {
      return this.generateTipWithHuggingFace({ prompt: _prompt, lang });
    } else {
      throw new Error('Unsupported service');
    }
  }

  // Generate a tip using OpenAI service
  async generateTipWithOpenAI(
    generateTipDto: GenerateTipDto,
  ): Promise<TipEntity> {
    const { prompt, lang } = generateTipDto;

    // Generate content using OpenAI
    const content = await this.openaiService.generateTip(prompt, lang);
    const tip = new this.tipModel({ content });
    await tip.save();
    return TipsMapper.toTipEntity(tip);
  }

  // Generate a tip using HuggingFace service
  async generateTipWithHuggingFace(
    generateTipDto: GenerateTipDto,
  ): Promise<TipEntity> {
    const { prompt, lang } = generateTipDto;

    try {
      // Generate content based on the prompt
      const content = await this.huggingFaceService.generateText(prompt);

      const translationsMap = await this.getTranslations(content, lang);

      // Save the new Tip to the database
      const newTip = await this.saveTip(translationsMap);

      return newTip;
    } catch (error) {
      console.error('Error generating tip:', error);

      // Error handling: throw a user-friendly exception
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
