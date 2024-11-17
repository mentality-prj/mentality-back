import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProviderType, User, UserRole } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOrCreateUser(
    email: string,
    name?: string,
    avatarUrl?: string,
    role: UserRole = 'user',
    providers?: {
      type: ProviderType;
      id: string;
    }[],
  ): Promise<User> {
    let user = await this.userModel.findOne({ email });
    if (!user) {
      user = new this.userModel({ email, name, avatarUrl, role, providers });
      await user.save();
    } else {
      // If the user exists, add a new provider if it does not exist
      for (const provider of providers) {
        if (
          !user.providers.some(
            (p) => p.type === provider.type && p.id === provider.id,
          )
        ) {
          user.providers.push(provider);
        }
      }
      await user.save();
    }
    return user;
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
}
