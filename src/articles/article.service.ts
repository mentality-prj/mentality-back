import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { TagsService } from 'src/tags/tags.service';

import { ArticlesMapper } from './article.mapper';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { ArticleEntity } from './entities/article.entity';
import { Article } from './schemas/article.schema';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    readonly tagsService: TagsService,
  ) {}

  async getManyWithPagination(
    page: number,
    limit: number,
    tagId?: string,
  ): Promise<{ data: ArticleEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = tagId
      ? {
          tags: { $elemMatch: { _id: new Types.ObjectId(tagId) } },
        }
      : {};
    const [articles, total] = await Promise.all([
      this.articleModel.find(query).skip(skip).limit(limit).exec(),
      this.articleModel.countDocuments(query).exec(),
    ]);
    const data = articles.map(ArticlesMapper.toArticleEntity);

    return { data, total };
  }

  async create(payload: CreateArticleDto): Promise<ArticleEntity> {
    const { tags, ...rest } = payload;
    try {
      const newArticle = new this.articleModel(rest);

      if (tags?.length > 0) {
        const existingTags = await this.tagsService.getTagsByIds(tags);
        newArticle.tags = existingTags;
      }

      await newArticle.save();
      return ArticlesMapper.toArticleEntity(newArticle);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, payload: UpdateArticleDto): Promise<ArticleEntity> {
    const { tags, tagsToRemove, ...rest } = payload;

    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(
        id,
        {
          ...rest,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updatedArticle) {
      throw new NotFoundException('Article not found');
    }

    if (tags?.length > 0) {
      const existingTags = await this.tagsService.getTagsByIds(tags);
      const articleTags = updatedArticle.tags.map((t) => t._id.toString());
      const matchingTags = tags.filter((tag) => articleTags.includes(tag));

      if (matchingTags.length > 0) {
        throw new ConflictException(
          `Tags already associated with the article: ${matchingTags.join(', ')}`,
        );
      }

      updatedArticle.tags.push(...existingTags);
    }

    if (tagsToRemove?.length) {
      updatedArticle.tags = updatedArticle.tags.filter(
        (tag) => !tagsToRemove.includes(tag._id.toString()),
      );
    }

    return ArticlesMapper.toArticleEntity(await updatedArticle.save());
  }

  async getOneById(id: string): Promise<ArticleEntity> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new BadRequestException('Article not found.');
    }

    return ArticlesMapper.toArticleEntity(article);
  }

  async getOneByIdForUpdate(id: string): Promise<Article> {
    return await this.articleModel.findById(id).exec();
  }

  async deleteOneById(id: string): Promise<boolean> {
    const result = await this.articleModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return false;
    }

    return true;
  }
}
