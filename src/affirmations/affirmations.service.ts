import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
    });

    return newAffirmation;
  }

  async getAllAffirmations(): Promise<Affirmation[]> {
    return this.affirmationModel.find().sort({ createdAt: -1 }).exec();
  }
}
