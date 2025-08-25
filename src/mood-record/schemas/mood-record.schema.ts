import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { MOOD_MAX_LEVEL, MOOD_MIN_LEVEL } from 'src/constants';

@Schema()
export class MoodRecord extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, min: MOOD_MIN_LEVEL, max: MOOD_MAX_LEVEL })
  moodLevel: number;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ min: MOOD_MIN_LEVEL, max: MOOD_MAX_LEVEL })
  stressLevel?: number;

  @Prop({ default: false })
  active: boolean;
}

export const MoodRecordSchema = SchemaFactory.createForClass(MoodRecord);
