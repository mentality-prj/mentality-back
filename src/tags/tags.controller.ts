import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { Tag } from './schemas/tag.schema';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAllTags(): Promise<Tag[]> {
    return this.tagsService.getAllTags();
  }

  @Get(':id')
  async getTagById(@Param('id') id: string): Promise<Tag> {
    return this.tagsService.getTagById(id);
  }

  @Post()
  async createTag(@Body('name') name: string): Promise<Tag> {
    return this.tagsService.createTag(name);
  }
}
