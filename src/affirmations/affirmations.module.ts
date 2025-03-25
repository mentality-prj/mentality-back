import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OpenaiModule } from 'src/openai/openai.module';

import { AffirmationsController } from './affirmations.controller';
import { AffirmationsService } from './affirmations.service';
import { Affirmation, AffirmationSchema } from './schemas/affirmation.schema';

/**
 * The `AffirmationsModule` is a NestJS module that manages the affirmations feature of the application.
 *
 * This module is responsible for:
 * - Importing the necessary dependencies:
 *   - `MongooseModule.forFeature`: Registers the `Affirmation` schema with Mongoose for database interactions.
 *   - `OpenaiModule`: Provides integration with OpenAI services for generating or processing affirmations.
 * - Providing the `AffirmationsService` to handle business logic related to affirmations.
 * - Registering the `AffirmationsController` to handle HTTP requests related to affirmations.
 */
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
