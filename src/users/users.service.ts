import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOrCreateUser(
    googleId: string,
    email: string,
    name?: string,
    avatarUrl?: string,
  ): Promise<User> {
    let user = await this.userModel.findOne({ email });
    if (!user) {
      user = new this.userModel({ googleId, email, name, avatarUrl });
      await user.save();
    }
    return user;
  }
}
