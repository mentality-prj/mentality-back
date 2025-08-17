import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { Model } from 'mongoose';

import {
  defaultAffirmationImagePrompt,
  defaultAffirmationPrompts,
} from 'src/constants/affirmations/prompts';
import { SUPPORTED_LANGUAGES } from 'src/constants/supported-languages.constant';
import { HuggingFaceService } from 'src/huggingface/huggingface.service';
import { OpenaiService } from 'src/openai/openai.service';
import { TranslationsService } from 'src/translations/translations.service';

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

  async saveAffirmation({
    translations,
    cloudinaryUrl,
  }: {
    translations: AffirmationEntity['translations'];
    cloudinaryUrl: string;
  }): Promise<AffirmationEntity> {
    const newAffirmation = new this.affirmationModel({
      translations: translations,
      createdAt: new Date(),
      imageUrl: cloudinaryUrl,
    });
    await newAffirmation.save();
    return AffirmationsMapper.toAffirmationEntity(newAffirmation);
  }

  async uploadToCloudinary(imageUrl: string): Promise<string> {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: 'affirmations',
      });
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary.');
    }
  }

  async generateAffirmation(
    generateAffirmationDto: GenerateAffirmationDto,
  ): Promise<AffirmationEntity> {
    const { prompt, lang } = generateAffirmationDto;
    const _prompt = prompt || defaultAffirmationPrompts[`${lang}`];

    return this.generateAffirmationWithOpenAI({ prompt: _prompt, lang });
  }

  async generateImage(prompt: string): Promise<string> {
    const safePrompt = prompt || defaultAffirmationImagePrompt;

    try {
      const imageUrl = await this.openaiService.generateImage(safePrompt);
      return imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate image. Please try again later.');
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

      const imagePrompt =
        lang !== SUPPORTED_LANGUAGES.ENG
          ? translationsMap[SUPPORTED_LANGUAGES.ENG]
          : content;

      const imageUrl = await this.generateImage(imagePrompt);
      const cloudinaryUrl = await this.uploadToCloudinary(imageUrl);

      const newAffirmation = await this.saveAffirmation({
        translations: translationsMap,
        cloudinaryUrl,
      });

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

  async getAllAffirmations(): Promise<AffirmationEntity[]> {
    const affirmations = await this.affirmationModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
    return affirmations.map(AffirmationsMapper.toAffirmationEntity);
  }
}
