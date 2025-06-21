import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import {
  SUPPORTED_LANGUAGES_KEYS,
  SupportedLanguages,
} from 'src/constants/supported-languages.constant';

@Schema()
export class Tag extends Document {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({
    type: Object,
    required: true,
    validate: {
      validator: (name: Record<SupportedLanguages, string>) =>
        Object.keys(name).every((key: SupportedLanguages) =>
          SUPPORTED_LANGUAGES_KEYS.includes(key),
        ),
      message: 'Invalid language keys in translations field',
    },
  })
  translations: Record<SupportedLanguages, string>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
