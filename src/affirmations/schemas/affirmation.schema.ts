import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: false, versionKey: false })
export class Affirmation extends Document {
  @Prop({ type: Object, required: true })
  translations: Record<string, string>;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  isPublished: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AffirmationSchema = SchemaFactory.createForClass(Affirmation);
