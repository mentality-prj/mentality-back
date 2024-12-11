import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SupportedLanguage } from './constants/supported-languages.constant';
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
      throw new NotFoundException('Tag not found');
    }
    return TagsMapper.toTagEntity(tag);
  }

  async createTag(
    key: string,
    translations: Record<SupportedLanguage, string>,
  ): Promise<NewTagEntity> {
    const newTag = await this.tagModel.create({ key, translations });
    return TagsMapper.toTagEntity(newTag);
  }

  async updateTag(
    id: string,
    translations: Record<SupportedLanguage, string>,
  ): Promise<TagEntity> {
    const updatedTag = await this.tagModel
      .findByIdAndUpdate(
        id,
        { translations, updatedAt: new Date() },
        { new: true },
      )
      .exec();
    if (!updatedTag) {
      throw new NotFoundException('Tag not found');
    }
    return TagsMapper.toTagEntity(updatedTag);
  }
}
