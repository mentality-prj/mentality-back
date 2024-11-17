import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ProviderType {
  GOOGLE = 'google',
  GITHUB = 'github',
}

export type UserRole = 'admin' | 'user';

export interface Provider {
  type: ProviderType;
  id: string;
}

@Schema()
export class User extends Document {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  name?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ required: true })
  role: UserRole;

  @Prop({ type: [{ type: { type: String, enum: ProviderType }, id: String }] })
  providers: Provider[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
