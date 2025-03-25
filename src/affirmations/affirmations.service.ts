import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LIMIT, PAGE } from 'src/constants';

import { MockOpenAIService } from './__mock__/mock-openai.service';
import { Affirmation } from './schemas/affirmation.schema';

@Injectable()
export class AffirmationsService {
  private openAIService: MockOpenAIService;
  // Inject the Affirmation model
  constructor(
    @InjectModel(Affirmation.name) private affirmationModel: Model<Affirmation>,
  ) {
    this.openAIService = new MockOpenAIService();
  }

  // Generate an affirmation text
  async generateAffirmationText(): Promise<string> {
    const texts = await this.openAIService.generateAffirmationText();
    // Return the first text if it exists
    return Array.isArray(texts) && texts.length > 0 ? texts[0] : '';
  }

  // Generate an image
  async generateImage(_prompt: string): Promise<string> {
    const images = await this.openAIService.generateImage(_prompt);
    // Return the first image if it exists
    return Array.isArray(images) && images.length > 0 ? images[0] : '';
  }

  // Upload to Cloudinary
  async uploadToCloudinary(imageUrl: string): Promise<string> {
    return imageUrl;
  }

  // Generate and save an affirmation
  async generateAndSaveAffirmation(): Promise<Affirmation> {
    // Generate an affirmation value
    const text = await this.generateAffirmationText();
    const imageUrl = await this.generateImage(text);
    const cloudinaryUrl = await this.uploadToCloudinary(imageUrl);

    // Create a new affirmation
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

    // Fetch affirmations sorted by creation date in descending order
    const affirmations = await this.affirmationModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Count the total number of affirmations in the database
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
