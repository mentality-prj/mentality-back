import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OpenaiModule } from 'src/openai/openai.module';

import { AffirmationsController } from './affirmations.controller';
import { AffirmationsService } from './affirmations.service';
import { Affirmation, AffirmationSchema } from './schemas/affirmation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Affirmation.name, schema: AffirmationSchema },
    ]),
    OpenaiModule,
  ],
  providers: [AffirmationsService],
  controllers: [AffirmationsController],
})
export class AffirmationsModule {}
