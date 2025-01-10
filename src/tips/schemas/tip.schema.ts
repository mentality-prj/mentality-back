import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from 'src/constants/supported-languages.constant';

@Schema()
export class Tip extends Document {
  @Prop({
    type: Object,
    required: true,
    validate: {
      validator: (content: Record<SupportedLanguage, string>) =>
        Object.keys(content).every((key: SupportedLanguage) =>
          SUPPORTED_LANGUAGES.includes(key),
        ),
      message: 'Invalid language keys in content field',
    },
  })
  translations: Record<SupportedLanguage, string>;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TipSchema = SchemaFactory.createForClass(Tip);
