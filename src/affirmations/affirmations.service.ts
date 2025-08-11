import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AI } from 'src/constants';
import { defaultAffirmationPrompts } from 'src/constants/affirmations/prompts';
import { HuggingFaceService } from 'src/huggingface/huggingface.service';
import { OpenaiService } from 'src/openai/openai.service';
import { TranslationsService } from 'src/translations/translations.service';
import { AIType } from 'src/types';

import { GenerateAffirmationDto, UpdateAffirmationDto } from './dtos';
import { AffirmationEntity } from './entities/affirmation.entity';
import { AffirmationsMapper } from './helpers/affirmation.mapper';
import { Affirmation } from './schemas/affirmation.schema';

@Injectable()
export class AffirmationsService {
  constructor(
    @InjectModel('Affirmation') private affirmationModel: Model<Affirmation>,
    private readonly openaiService: OpenaiService,
    private readonly huggingFaceService: HuggingFaceService,
    private readonly translationsService: TranslationsService,
  ) {}

  async saveAffirmation(
    translations: AffirmationEntity['translations'],
  ): Promise<AffirmationEntity> {
    const newAffirmation = new this.affirmationModel({
      translations: translations,
      createdAt: new Date(),
      isPublished: false,
    });
    await newAffirmation.save();
    return AffirmationsMapper.toAffirmationEntity(newAffirmation);
  }

  async generateAffirmation(
    generateAffirmationDto: GenerateAffirmationDto,
    service: AIType,
  ): Promise<AffirmationEntity> {
    const { prompt, lang } = generateAffirmationDto;
    const _prompt = prompt || defaultAffirmationPrompts[`${lang}`];

    if (service === AI.OpenAI) {
      return this.generateAffirmationWithOpenAI({ prompt: _prompt, lang });
      // } else if (service === AI.HuggingFace) {
      //   return this.generateAffirmationWithHuggingFace({ prompt: _prompt, lang });
    } else {
      throw new Error('Unsupported service');
    }
  }

  async generateAffirmationWithOpenAI(
    generateAffirmationDto: GenerateAffirmationDto,
  ): Promise<AffirmationEntity> {
    const { prompt, lang } = generateAffirmationDto;

    try {
      const content = await this.openaiService.generateAffirmation(prompt);

      const translationsMap = await this.translationsService.getTranslations(
        content,
        lang,
      );

      const newAffirmation = await this.saveAffirmation(translationsMap);

      return newAffirmation;
    } catch (error) {
      console.error('Error generating affirmation:', error);
      throw new Error(
        'Failed to generate affirmation. Please try again later.',
      );
    }
  }

  async getManyAffirmationsWithPagination(
    page: number,
    limit: number,
  ): Promise<{ data: AffirmationEntity[]; total: number }> {
    const skip = (page - 1) * limit;

    const [affirmations, total] = await Promise.all([
      this.affirmationModel.find().skip(skip).limit(limit).exec(),
      this.affirmationModel.countDocuments().exec(),
    ]);
    const data = affirmations.map(AffirmationsMapper.toAffirmationEntity);

    return { data, total };
  }

  async getAllUnpublishedAffirmations(): Promise<AffirmationEntity[]> {
    const unpublishedAffirmations = await this.affirmationModel
      .find({ isPublished: false })
      .sort({ createdAt: -1 })
      .exec();

    return unpublishedAffirmations.map(AffirmationsMapper.toAffirmationEntity);
  }

  async updateAffirmation(
    id: string,
    updateAffirmationDto: UpdateAffirmationDto,
  ): Promise<AffirmationEntity> {
    const { translations, isPublished } = updateAffirmationDto;

    const updatedAffirmation = await this.affirmationModel
      .findByIdAndUpdate(
        id,
        { translations, updatedAt: new Date(), isPublished },
        { new: true },
      )
      .exec();

    if (!updatedAffirmation) {
      throw new NotFoundException('Affirmation not found');
    }

    return AffirmationsMapper.toAffirmationEntity(updatedAffirmation);
  }

  async deleteAffirmationById(id: string): Promise<boolean> {
    const result = await this.affirmationModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return false;
    }

    return true;
  }

  async generateImage(
    generateAffirmationDto: GenerateAffirmationDto,
  ): Promise<string> {
    const { prompt, lang } = generateAffirmationDto;
    const _prompt = prompt || defaultAffirmationPrompts[`${lang}`];

    try {
      // Assuming OpenaiService has a method generateImage(prompt: string): Promise<string>
      const imageUrl = await this.openaiService.generateImage(_prompt);
      return imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate image. Please try again later.');
    }
  }
}
