import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesController } from './articles/articles.controller';
import { OpenaiService } from './openai/openai.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, ArticlesController],
  providers: [AppService, OpenaiService],
})
export class AppModule {}
