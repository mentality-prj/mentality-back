import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { DiaryEntity } from './entities/diary.entity';
import { DiaryMapper } from './helpers/diary.mapper';
import { Diary } from './schemas/diary.schema';

@Injectable()
export class DiaryService {
  constructor(@InjectModel(Diary.name) private diaryModel: Model<Diary>) {}

  async create(createDiaryDto: CreateDiaryDto): Promise<DiaryEntity> {
    const diary = new this.diaryModel(createDiaryDto);
    const savedDiary = await diary.save();
    return DiaryMapper.toDiaryEntity(savedDiary);
  }

  async findAllByUser(userId: string): Promise<DiaryEntity[]> {
    const diaries = await this.diaryModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
    return diaries.map(DiaryMapper.toDiaryEntity);
  }

  async findOne(id: string): Promise<DiaryEntity> {
    const diary = await this.diaryModel.findById(id).exec();
    if (!diary) throw new NotFoundException('Diary entry not found');
    return DiaryMapper.toDiaryEntity(diary);
  }

  async update(
    id: string,
    updateDiaryDto: UpdateDiaryDto,
  ): Promise<DiaryEntity> {
    const diary = await this.diaryModel
      .findByIdAndUpdate(id, updateDiaryDto, { new: true })
      .exec();
    if (!diary) throw new NotFoundException('Diary entry not found');
    return DiaryMapper.toDiaryEntity(diary);
  }

  async activate(id: string): Promise<DiaryEntity> {
    const diary = await this.diaryModel
      .findByIdAndUpdate(id, { isActive: true }, { new: true })
      .exec();
    if (!diary) throw new NotFoundException('Diary entry not found');
    return DiaryMapper.toDiaryEntity(diary);
  }
}
