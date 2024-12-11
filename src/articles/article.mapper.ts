import { TagsMapper } from 'src/tags/tags.mapper';

import { ArticleEntity } from './entities/article.entity';
import { Article } from './schemas/article.schema';

export class ArticlesMapper {
  static toArticleEntity(article: Article): ArticleEntity {
    return {
      id: article._id.toString(),
      title: article.title,
      content: article.content,
      author: article?.author,
      createdAt: article.createdAt,
      updatedAt:
        article.updatedAt !== article.createdAt ? article.updatedAt : undefined,

      tags:
        article.tags?.length > 0
          ? article.tags.map(TagsMapper.toTagEntity)
          : [],
    };
  }
}
