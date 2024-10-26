import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('articles')
export class ArticlesController {
  @Get()
  findAll() {
    return 'This action returns all articles';
  }

  @Post()
  create(@Body() createArticleDto: any) {
    return `This action adds a new article with title: ${createArticleDto.title}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns article with id: ${id}`;
  }
}
