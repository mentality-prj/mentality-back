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
    // Initialize the mock OpenAI service
    this.openAIService = new MockOpenAIService();
  }

  // Generate a single affirmation text using the mock OpenAI service
  async generateAffirmationText(): Promise<string> {
    const texts = await this.openAIService.generateAffirmationText();
    // Return the first text if available, otherwise return an empty string
    return Array.isArray(texts) && texts.length > 0 ? texts[0] : '';
  }

  // Generate an image based on a given prompt using the mock OpenAI service
  async generateImage(_prompt: string): Promise<string> {
    const images = await this.openAIService.generateImage(_prompt);
    // Return the first image URL if available, otherwise return an empty string
    return Array.isArray(images) && images.length > 0 ? images[0] : '';
  }

  // Simulate uploading an image to Cloudinary and return the image URL
  async uploadToCloudinary(imageUrl: string): Promise<string> {
    return imageUrl;
  }

  // Generate an affirmation (text and image), save it to the database, and return the saved affirmation
  async generateAndSaveAffirmation(): Promise<Affirmation> {
    // Generate affirmation text
    const text = await this.generateAffirmationText();
    // Generate an image based on the text
    const imageUrl = await this.generateImage(text);
    // Simulate uploading the image to Cloudinary
    const cloudinaryUrl = await this.uploadToCloudinary(imageUrl);

    // Create a new affirmation document in the database
    const newAffirmation = await this.affirmationModel.create({
      text,
      imageUrl: cloudinaryUrl,
      isPublished: false, // Default to not published
    });

    return newAffirmation;
  }

  // Retrieve a paginated list of affirmations from the database
  async getManyAffirmationsWithPagination(
    page: number = PAGE,
    limit: number = LIMIT,
  ): Promise<{ data: Affirmation[]; total: number }> {
    // Calculate the number of documents to skip based on the page and limit
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

  // Update the publication status of an affirmation by its ID
  async updateAffirmation(
    id: string,
    isPublished: boolean,
  ): Promise<Affirmation> {
    // Find the affirmation by ID and update its publication status
    const updatedAffirmation = await this.affirmationModel
      .findByIdAndUpdate(id, { isPublished }, { new: true })
      .exec();

    // Throw an error if the affirmation is not found
    if (!updatedAffirmation) {
      throw new Error('Affirmation not found');
    }

    return updatedAffirmation;
  }
}
