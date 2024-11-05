import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ProviderType {
  GOOGLE = 'google',
  GITHUB = 'github',
}

@Schema()
export class User extends Document {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  name?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({
    type: {
      type: String,
      enum: ProviderType,
      required: true,
    },
    id: { type: String, required: true },
  })
  provider?: {
    type: ProviderType;
    id: string;
  };

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
