import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Provider, Roles, User, UserRole } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOrCreateUser(
    email: string,
    name?: string,
    avatarUrl?: string,
    role: UserRole = Roles.USER,
    providers: Provider[] = [],
  ): Promise<{ user: User; isNewUser: boolean }> {
    let user = await this.userModel.findOne({ email });
    let isNewUser = false;

    if (!user) {
      user = new this.userModel({ email, name, avatarUrl, role, providers });
      await user.save();
      isNewUser = true;
    } else {
      let updated = false;

      // If the user exists, add a new provider if it does not exist
      for (const provider of providers) {
        const existingProvider = user.providers.find(
          (p) => p.type === provider.type,
        );

        if (existingProvider) {
          // If a provider with this type already exists, update its id
          if (existingProvider.id !== provider.id) {
            existingProvider.id = provider.id;
            updated = true;
          }
        } else {
          // If there is no provider with this type, add a new one
          user.providers.push(provider);
          updated = true;
        }
      }

      if (updated) {
        await user.save();
      }
    }
    return { user, isNewUser };
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
}
