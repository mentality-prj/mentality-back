import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Diary extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const DiarySchema = SchemaFactory.createForClass(Diary);
