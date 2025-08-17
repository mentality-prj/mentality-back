import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { SupportedLanguages } from 'src/constants/supported-languages.constant';

@Schema({ timestamps: false, versionKey: false })
export class Affirmation extends Document {
  @Prop({ type: Object, required: true })
  translations: Record<SupportedLanguages, string>;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  isPublished: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AffirmationSchema = SchemaFactory.createForClass(Affirmation);
