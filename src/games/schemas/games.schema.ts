import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: false, versionKey: false })
export class Games extends Document {
  @Prop({ type: Object, required: true })
  textGames: Record<string, any>;

  @Prop({ required: true })
  isPublished: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const GamesSchema = SchemaFactory.createForClass(Games);
