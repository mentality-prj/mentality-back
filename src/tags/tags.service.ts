import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Tag } from './schemas/tag.schema';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {}

  async createTag(name: string): Promise<Tag> {
    const tag = new this.tagModel({ name });
    return tag.save();
  }

  async getAllTags(): Promise<Tag[]> {
    return this.tagModel.find().exec();
  }

  async getTagById(id: string): Promise<Tag> {
    return this.tagModel.findById(id).exec();
  }
}
