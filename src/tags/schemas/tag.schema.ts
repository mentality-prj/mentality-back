import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from 'src/constants/supported-languages.constant';

@Schema()
export class Tag extends Document {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({
    type: Object,
    required: true,
    validate: {
      validator: (name: Record<SupportedLanguage, string>) =>
        Object.keys(name).every((key: SupportedLanguage) =>
          SUPPORTED_LANGUAGES.includes(key),
        ),
      message: 'Invalid language keys in name field',
    },
  })
  translations: Record<SupportedLanguage, string>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
