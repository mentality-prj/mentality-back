import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { DiaryEntity } from './entities/diary.entity';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  async create(@Body() createDiaryDto: CreateDiaryDto): Promise<DiaryEntity> {
    return this.diaryService.create(createDiaryDto);
  }

  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string): Promise<DiaryEntity[]> {
    return this.diaryService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DiaryEntity> {
    return this.diaryService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiaryDto: UpdateDiaryDto,
  ): Promise<DiaryEntity> {
    return this.diaryService.update(id, updateDiaryDto);
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string): Promise<DiaryEntity> {
    return this.diaryService.activate(id);
  }
}
