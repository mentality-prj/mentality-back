import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { Model } from 'mongoose';

import { LIMIT, PAGE } from 'src/constants';

import { MockOpenAIService } from './__mock__/mock-openai.service';
import { AffirmationEntity } from './entities/affirmation.entity';
import { AffirmationsMapper } from './helpers/affirmation.mapper';
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
    const images = this.openAIService.generateImage(_prompt);
    // Return the first image if it exists
    return Array.isArray(images) && images.length > 0 ? images[0] : '';
  }

  // Upload to Cloudinary
  async uploadToCloudinary(openaiImageUrl: string): Promise<string> {
    const cloudinaryResponse = await cloudinary.uploader.upload(
      openaiImageUrl,
      {
        folder: 'affirmations',
        public_id: `affirmation-${Date.now()}`,
      },
    );

    if (!cloudinaryResponse.secure_url) {
      throw new InternalServerErrorException(
        'Failed to upload image to Cloudinary',
      );
    }

    return cloudinaryResponse.secure_url;
  }

  // Generate and save an affirmation
  async generateAndSaveAffirmation(): Promise<AffirmationEntity> {
    // Generate an affirmation value
    const text = await this.generateAffirmationText();
    const imageUrl = await this.generateImage(text);
    const cloudinaryUrl = await this.uploadToCloudinary(imageUrl);

    // Create a new affirmation
    const newAffirmation = new this.affirmationModel({
      text,
      imageUrl: cloudinaryUrl,
      isPublished: false,
    });

    await newAffirmation.save();

    return AffirmationsMapper.toAffirmationEntity(newAffirmation);
  }

  // Get affirmations with pagination
  async getManyAffirmationsWithPagination(
    page: number = PAGE,
    limit: number = LIMIT,
  ): Promise<{ data: AffirmationEntity[]; total: number }> {
    const skip = (page - 1) * limit;

    // Get affirmations while skipping and limiting the results
    const [affirmations, total] = await Promise.all([
      this.affirmationModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      //  Get the total count of affirmations
      this.affirmationModel.countDocuments().exec(),
    ]);
    const data = affirmations.map(AffirmationsMapper.toAffirmationEntity);

    return { data, total };
  }

  async getAllUnpublishedAffirmations(): Promise<AffirmationEntity[]> {
    const unpublishedAffirmations = await this.affirmationModel
      .find({
        isPublished: false,
      })
      .sort({ createdAt: -1 })
      .exec();

    return unpublishedAffirmations.map(AffirmationsMapper.toAffirmationEntity);
  }

  //  Update an affirmation
  async updateAffirmation(
    id: string,
    isPublished: boolean,
  ): Promise<AffirmationEntity> {
    // Update the affirmation's published
    const updatedAffirmation = await this.affirmationModel
      .findByIdAndUpdate(id, { isPublished }, { new: true })
      .exec();
    // Throw an error if the affirmation is not found
    if (!updatedAffirmation) {
      throw new NotFoundException('Affirmation not found');
    }

    return AffirmationsMapper.toAffirmationEntity(updatedAffirmation);
  }

  async getAllAffirmations(): Promise<AffirmationEntity[]> {
    const affirmations = await this.affirmationModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
    return affirmations.map(AffirmationsMapper.toAffirmationEntity);
  }
}
