import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LIMIT, PAGE } from 'src/constants';

import { MockOpenAIService } from './__mock__/mock-openai.service';
import { Affirmation } from './schemas/affirmation.schema';

@Injectable()
export class AffirmationsService {
  private openAIService: MockOpenAIService;

  constructor(
    @InjectModel(Affirmation.name) private affirmationModel: Model<Affirmation>,
  ) {
    this.openAIService = new MockOpenAIService();
  }

  async generateAffirmationText(): Promise<string> {
    const texts = await this.openAIService.generateAffirmationText();
    return Array.isArray(texts) && texts.length > 0 ? texts[0] : '';
  }

  async generateImage(_prompt: string): Promise<string> {
    const images = await this.openAIService.generateImage(_prompt);
    return Array.isArray(images) && images.length > 0 ? images[0] : '';
  }

  async uploadToCloudinary(imageUrl: string): Promise<string> {
    return imageUrl;
  }

  async generateAndSaveAffirmation(): Promise<Affirmation> {
    const text = await this.generateAffirmationText();
    const imageUrl = await this.generateImage(text);
    const cloudinaryUrl = await this.uploadToCloudinary(imageUrl);

    const newAffirmation = await this.affirmationModel.create({
      text,
      imageUrl: cloudinaryUrl,
      isPublished: false,
    });

    return newAffirmation;
  }

  async getManyAffirmationsWithPagination(
    page: number = PAGE,
    limit: number = LIMIT,
  ): Promise<{ data: Affirmation[]; total: number }> {
    const skip = (page - 1) * limit;

    const affirmations = await this.affirmationModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.affirmationModel.countDocuments().exec();
    return { data: affirmations as Affirmation[], total };
  }

  async updateAffirmation(
    id: string,
    isPublished: boolean,
  ): Promise<Affirmation> {
    const updatedAffirmation = await this.affirmationModel
      .findByIdAndUpdate(id, { isPublished }, { new: true })
      .exec();

    if (!updatedAffirmation) {
      throw new Error('Affirmation not found');
    }

    return updatedAffirmation;
  }
}
