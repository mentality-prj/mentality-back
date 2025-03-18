import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OpenaiModule } from 'src/openai/openai.module';

import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { Games, GamesSchema } from './schemas/games.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Games.name, schema: GamesSchema }]),
    OpenaiModule,
  ],
  providers: [GamesService],
  controllers: [GamesController],
  exports: [GamesService],
})
export class GamesModule {}
