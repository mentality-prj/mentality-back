import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Tag } from 'src/tags/schemas/tag.schema';

import { CreateArticleDto } from '../dtos/create-article.dto';

@Schema()
export class Article extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: false })
  content: string;

  @Prop({ required: false, unique: false })
  author?: string;

  @Prop({ required: false, unique: false, default: false })
  isPublished?: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Tag', index: true })
  tags: Tag[];

  @Prop({ default: Date.now })
  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  constructor(payload?: CreateArticleDto) {
    if (!payload) return;
    super();
    this.title = payload.title;
    this.content = payload.content;
    this.author = payload.author;
  }
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
