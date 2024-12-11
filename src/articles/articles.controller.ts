import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

import { LIMIT, PAGE } from 'src/constants';
import { ApiCustomResponses } from 'src/helpers/decorators';

import { ArticlesService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiCustomResponses({
    summary: 'Get many(by tag or not) articles with pagination',
    responses: [
      {
        status: HttpStatus.OK,
        description: 'Articles successfully retrieved.',
        type: [ArticleEntity],
      },
    ],
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: PAGE })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: LIMIT })
  @ApiQuery({
    name: 'tagId',
    required: false,
    type: String,
    example: '64a1f8e5c6e2abcf1e8b1234',
  })
  @Get()
  async getManyWithPagination(
    @Query('page', new ParseIntPipe()) page = PAGE,
    @Query('limit', new ParseIntPipe()) limit = LIMIT,
    @Query('tagId') tagId: string,
  ): Promise<{ data: ArticleEntity[]; total: number }> {
    const { data, total } = await this.articlesService.getManyWithPagination(
      page,
      limit,
      tagId,
    );
    return { data, total };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiCustomResponses({
    summary: 'Create a new article',
    responses: [
      {
        status: HttpStatus.CREATED,
        description: 'Article successfully created.',
        type: ArticleEntity,
      },
    ],
  })
  async create(@Body() payload: CreateArticleDto): Promise<ArticleEntity> {
    return this.articlesService.create(payload);
  }

  @ApiCustomResponses({
    summary: 'Update article by id',
    responses: [
      {
        status: HttpStatus.OK,
        description: 'Article successfully updated.',
        type: ArticleEntity,
      },
      { status: HttpStatus.NOT_FOUND, description: 'Article not found.' },
    ],
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    return this.articlesService.update(id, payload);
  }

  @ApiCustomResponses({
    summary: 'Get article by id',
    responses: [
      {
        status: HttpStatus.OK,
        description: 'Article successfully retrieved.',
        type: ArticleEntity,
      },
      { status: HttpStatus.NOT_FOUND, description: 'Article not found.' },
    ],
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ArticleEntity> {
    return this.articlesService.getOneById(id);
  }

  @ApiCustomResponses({
    summary: 'Delete article by id',
    responses: [
      {
        status: HttpStatus.OK,
        description: 'Article successfully deleted.',
        type: Boolean,
      },
    ],
  })
  @Delete(':id')
  async deleteOneById(@Param('id') id: string): Promise<boolean> {
    return this.articlesService.deleteOneById(id);
  }
}
