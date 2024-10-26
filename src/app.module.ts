import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesController } from './articles/articles.controller';
import { OpenaiService } from './openai/openai.service';

@Module({
  imports: [],
  controllers: [AppController, ArticlesController],
  providers: [AppService, OpenaiService],
})
export class AppModule {}
