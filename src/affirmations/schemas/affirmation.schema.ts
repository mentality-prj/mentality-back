import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: false, versionKey: false })
export class Affirmation extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AffirmationSchema = SchemaFactory.createForClass(Affirmation);
