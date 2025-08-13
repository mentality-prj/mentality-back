import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HuggingFaceModule } from 'src/huggingface/huggingface.module';
import { OpenaiModule } from 'src/openai/openai.module';
import { TranslationsModule } from 'src/translations/translations.module';

import { Tip, TipSchema } from './schemas/tip.schema';
import { TipsController } from './tips.controller';
import { TipsService } from './tips.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tip.name, schema: TipSchema }]),
    OpenaiModule,
    HuggingFaceModule,
    TranslationsModule,
  ],
  controllers: [TipsController],
  providers: [TipsService],
  exports: [TipsService],
})
export class TipsModule {}
