import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Tag extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
