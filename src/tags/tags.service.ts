import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { NewTagEntity, TagEntity } from './entities/tag.entity';
import { Tag } from './schemas/tag.schema';
import { TagsMapper } from './tags.mapper';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private readonly tagModel: Model<Tag>) {}

  async getAllTags(): Promise<TagEntity[]> {
    const tags = await this.tagModel.find().exec();
    return tags.map(TagsMapper.toTagEntity);
  }

  async getTagById(id: string): Promise<TagEntity> {
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new Error('Tag not found');
    }
    return TagsMapper.toTagEntity(tag);
  }

  async createTag(name: string): Promise<NewTagEntity> {
    const newTag = await this.tagModel.create({ name });
    return TagsMapper.toTagEntity(newTag);
  }

  async updateTag(id: string, name: string): Promise<TagEntity> {
    const updatedTag = await this.tagModel
      .findByIdAndUpdate(id, { name, updatedAt: new Date() }, { new: true })
      .exec();
    if (!updatedTag) {
      throw new Error('Tag not found');
    }
    return TagsMapper.toTagEntity(updatedTag);
  }
}
