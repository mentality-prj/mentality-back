import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HuggingFaceModule } from 'src/huggingface/huggingface.module';
import { OpenaiModule } from 'src/openai/openai.module';
import { TranslationsModule } from 'src/translations/translations.module';

import { AffirmationsController } from './affirmations.controller';
import { AffirmationsService } from './affirmations.service';
import { Affirmation, AffirmationSchema } from './schemas/affirmation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Affirmation.name, schema: AffirmationSchema },
    ]),
    OpenaiModule,
    HuggingFaceModule,
    TranslationsModule,
  ],
  providers: [AffirmationsService],
  controllers: [AffirmationsController],
  exports: [AffirmationsService],
})
export class AffirmationsModule {}
