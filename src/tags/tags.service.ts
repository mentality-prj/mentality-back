import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { NewTagEntity, TagEntity } from './entities/tag.entity';
import { TagsMapper } from './helpers/tags.mapper';
import { Tag } from './schemas/tag.schema';

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

  async createTag(createTagDto: CreateTagDto): Promise<NewTagEntity> {
    const newTag = await this.tagModel.create(createTagDto);
    return TagsMapper.toTagEntity(newTag);
  }

  async updateTag(id: string, updateTagDto: UpdateTagDto): Promise<TagEntity> {
    const updatedTag = await this.tagModel
      .findByIdAndUpdate(
        id,
        { ...updateTagDto, updatedAt: new Date() },
        { new: true },
      )
      .exec();
    if (!updatedTag) {
      throw new NotFoundException('Tag not found');
    }
    return TagsMapper.toTagEntity(updatedTag);
  }
}
