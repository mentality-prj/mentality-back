import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Diary } from './schemas/diary.schema';

@Injectable()
export class DiaryService {
  constructor(@InjectModel(Diary.name) private diaryModel: Model<Diary>) {}

  async create(createDiaryDto: CreateDiaryDto): Promise<Diary> {
    const diary = new this.diaryModel(createDiaryDto);
    return diary.save();
  }

  async findAllByUser(userId: string): Promise<Diary[]> {
    return this.diaryModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Diary> {
    const diary = await this.diaryModel.findById(id).exec();
    if (!diary) throw new NotFoundException('Diary entry not found');
    return diary;
  }

  async update(id: string, updateDiaryDto: UpdateDiaryDto): Promise<Diary> {
    const diary = await this.diaryModel
      .findByIdAndUpdate(id, updateDiaryDto, { new: true })
      .exec();
    if (!diary) throw new NotFoundException('Diary entry not found');
    return diary;
  }

  async activate(id: string): Promise<Diary> {
    const diary = await this.diaryModel
      .findByIdAndUpdate(id, { isActive: true }, { new: true })
      .exec();
    if (!diary) throw new NotFoundException('Diary entry not found');
    return diary;
  }
}
