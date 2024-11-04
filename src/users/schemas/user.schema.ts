import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  googleId: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  name?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
