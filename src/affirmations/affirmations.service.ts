import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MockOpenAIService } from './__mock__/mock-openai.service';
import { Affirmation } from './schemas/affirmation.schema';

const DEFAULT_LIMIT = 10;

@Injectable()
export class AffirmationsService {
  private openAIService: MockOpenAIService;

  constructor(
    @InjectModel(Affirmation.name) private affirmationModel: Model<Affirmation>,
  ) {
    this.openAIService = new MockOpenAIService();
  }

  async generateAffirmationText(): Promise<string> {
    return this.openAIService.generateAffirmationText();
  }

  async generateImage(_prompt: string): Promise<string> {
    return this.openAIService.generateImage(_prompt);
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

  async getAllAffirmations(
    page: number = 1,
    limit: number = DEFAULT_LIMIT,
  ): Promise<Affirmation[]> {
    const skip = (page - 1) * limit;

    return this.affirmationModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
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
