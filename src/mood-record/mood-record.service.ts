import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LIMIT, REPORT_LIMIT } from 'src/constants';

import { CreateMoodRecordDto } from './dto/create-mood-record.dto';
import { MoodRecordEntity } from './entities/mood-record.entity';
import { MoodRecordMapper } from './helpers/mood-record.mapper';
import { MoodRecord } from './schemas/mood-record.schema';

@Injectable()
export class MoodRecordService {
  constructor(
    @InjectModel(MoodRecord.name) private moodRecordModel: Model<MoodRecord>,
  ) {}

  async create(
    createMoodRecordDto: CreateMoodRecordDto,
  ): Promise<MoodRecordEntity> {
    const record = new this.moodRecordModel(createMoodRecordDto);
    await record.save();
    return MoodRecordMapper.toMoodRecordEntity(record);
  }

  async findAllByUser(
    userId: string,
    active?: boolean,
    page = 1,
    limit = LIMIT,
  ): Promise<{ data: MoodRecordEntity[]; total: number }> {
    // If active is not provided, we consider it true
    const query: any = { userId, active: active === undefined ? true : active };

    const total = await this.moodRecordModel.countDocuments(query);
    const records = await this.moodRecordModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      data: records.map(MoodRecordMapper.toMoodRecordEntity),
      total,
    };
  }

  async findOne(id: string): Promise<MoodRecordEntity> {
    const record = await this.moodRecordModel.findById(id).exec();
    if (!record) throw new NotFoundException('Mood record not found');
    return MoodRecordMapper.toMoodRecordEntity(record);
  }

  async updateWithOwnershipCheck(
    id: string,
    userId: string,
    update: Partial<MoodRecordEntity>,
  ): Promise<MoodRecordEntity> {
    const record = await this.moodRecordModel
      .findOneAndUpdate({ _id: id, userId }, update, { new: true })
      .exec();
    if (!record)
      throw new ForbiddenException('You do not have access to this record');
    return MoodRecordMapper.toMoodRecordEntity(record);
  }

  async findLastByUser(
    userId: string,
    limit = REPORT_LIMIT,
  ): Promise<MoodRecordEntity[]> {
    const query: Pick<MoodRecord, 'userId' | 'active'> = {
      userId,
      active: true,
    };
    const records = await this.moodRecordModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
    return records.map(MoodRecordMapper.toMoodRecordEntity);
  }

  async findOneWithOwnership(
    id: string,
    userId: string,
  ): Promise<MoodRecordEntity> {
    const record = await this.moodRecordModel
      .findOne({ _id: id, userId })
      .exec();
    if (!record)
      throw new ForbiddenException('You do not have access to this record');
    return MoodRecordMapper.toMoodRecordEntity(record);
  }
}
