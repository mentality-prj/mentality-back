import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Diary } from './schemas/diary.schema';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  async create(@Body() createDiaryDto: CreateDiaryDto): Promise<Diary> {
    return this.diaryService.create(createDiaryDto);
  }

  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string): Promise<Diary[]> {
    return this.diaryService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Diary> {
    return this.diaryService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiaryDto: UpdateDiaryDto,
  ): Promise<Diary> {
    return this.diaryService.update(id, updateDiaryDto);
  }

  @Post('activate/:id')
  async activate(@Param('id') id: string): Promise<Diary> {
    return this.diaryService.activate(id);
  }
}
