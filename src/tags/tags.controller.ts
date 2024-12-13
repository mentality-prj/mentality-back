import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SupportedLanguage } from 'src/constants/supported-languages.constant';

import { NewTagEntity, TagEntity } from './entities/tag.entity';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all tags' })
  @ApiResponse({
    status: 200,
    description: 'Tags successfully retrieved.',
    type: [TagEntity],
  })
  async getAllTags(): Promise<TagEntity[]> {
    return this.tagsService.getAllTags();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a tag by ID' })
  @ApiResponse({
    status: 200,
    description: 'Tag successfully retrieved.',
    type: TagEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Tag not found.',
  })
  async getTagById(@Param('id') id: string): Promise<TagEntity> {
    return this.tagsService.getTagById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({
    status: 201,
    description: 'Tag successfully created.',
    type: NewTagEntity,
  })
  async createTag(
    @Body('key') key: string,
    @Body('translations') translations: Record<SupportedLanguage, string>,
  ): Promise<NewTagEntity> {
    return this.tagsService.createTag(key, translations);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing tag' })
  @ApiResponse({
    status: 200,
    description: 'Tag successfully updated.',
    type: TagEntity,
  })
  async updateTag(
    @Param('id') id: string,
    @Body('translations') translations: Record<string, string>,
  ): Promise<TagEntity> {
    return this.tagsService.updateTag(id, translations);
  }
}
