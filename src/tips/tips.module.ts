import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OpenaiModule } from 'src/openai/openai.module';

import { TipSchema } from './schemas/tip.schema';
import { TipsController } from './tips.controller';
import { TipsService } from './tips.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Tip', schema: TipSchema }]),
    OpenaiModule,
  ],
  controllers: [TipsController],
  providers: [TipsService],
})
export class TipsModule {}
