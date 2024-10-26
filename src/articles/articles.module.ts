import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesController } from './articles.controller';
import { Article, ArticleSchema } from './schemas/article.schema';
import { OpenaiService } from '../openai/openai.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  controllers: [ArticlesController],
  providers: [OpenaiService],
})
export class ArticlesModule {}
