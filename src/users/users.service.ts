import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProviderType, User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOrCreateUser(
    email: string,
    name?: string,
    avatarUrl?: string,
    provider?: {
      type: ProviderType;
      id: string;
    },
  ): Promise<User> {
    let user = await this.userModel.findOne({ email });
    if (!user) {
      user = new this.userModel({ email, name, avatarUrl, provider });
      await user.save();
    }
    return user;
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
}
