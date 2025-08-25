import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MoodRecordController } from './mood-record.controller';
import { MoodRecordService } from './mood-record.service';
import { MoodRecord, MoodRecordSchema } from './schemas/mood-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MoodRecord.name, schema: MoodRecordSchema },
    ]),
  ],
  controllers: [MoodRecordController],
  providers: [MoodRecordService],
  exports: [MoodRecordService],
})
export class MoodRecordModule {}
