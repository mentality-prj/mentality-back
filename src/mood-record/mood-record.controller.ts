import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { REPORT_LIMIT } from 'src/constants';

import { CreateMoodRecordDto } from './dto/create-mood-record.dto';
import { UpdateMoodRecordDto } from './dto/update-mood-record.dto';
import { MoodRecordEntity } from './entities/mood-record.entity';
import { MoodRecordService } from './mood-record.service';

@Controller('mood-record')
export class MoodRecordController {
  constructor(private readonly moodRecordService: MoodRecordService) {}

  @Post()
  async create(
    @Body() createMoodRecordDto: CreateMoodRecordDto,
  ): Promise<MoodRecordEntity> {
    return this.moodRecordService.create(createMoodRecordDto);
  }

  @Get('user/:userId')
  async findAllByUser(
    @Param('userId') userId: string,
    @Query('active') active?: string,
  ): Promise<{ data: MoodRecordEntity[]; total: number }> {
    const activeBool = active === undefined ? undefined : active === 'true';
    return this.moodRecordService.findAllByUser(userId, activeBool);
  }

  @Get('user/:userId/last')
  async findLastByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ): Promise<MoodRecordEntity[]> {
    const lim = limit ? parseInt(limit, 10) : REPORT_LIMIT;
    return this.moodRecordService.findLastByUser(userId, lim);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<MoodRecordEntity> {
    return this.moodRecordService.findOneWithOwnership(id, userId);
  }

  @Patch(':id/active')
  async setActive(
    @Param('id') id: string,
    @Body() body: UpdateMoodRecordDto,
  ): Promise<MoodRecordEntity> {
    // Ownership check and update are handled in the service
    return this.moodRecordService.updateWithOwnershipCheck(id, body.userId, {
      active: body.active,
    });
  }
}
