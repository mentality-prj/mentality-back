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

  // Get affirmations with pagination
  async getManyAffirmationsWithPagination(
    page: number = PAGE,
    limit: number = LIMIT,
  ): Promise<{ data: Affirmation[]; total: number }> {
    const skip = (page - 1) * limit;
    // Get affirmations while skipping and limiting the results
    const affirmations = await this.affirmationModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    //  Get the total count of affirmations
    const total = await this.affirmationModel.countDocuments().exec();
    return { data: affirmations as Affirmation[], total };
  }

  //  Update an affirmation
  async updateAffirmation(
    id: string,
    isPublished: boolean,
  ): Promise<Affirmation> {
    // Update the affirmation's published
    const updatedAffirmation = await this.affirmationModel
      .findByIdAndUpdate(id, { isPublished }, { new: true })
      .exec();
    // Throw an error if the affirmation is not found
    if (!updatedAffirmation) {
      throw new Error('Affirmation not found');
    }

    return updatedAffirmation;
  }

  async getAllAffirmations(): Promise<Affirmation[]> {
    return this.affirmationModel.find().sort({ createdAt: -1 }).exec();
  }
}
