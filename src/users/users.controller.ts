import { Body, Controller, Post } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('oauth')
  async handleOAuth(
    @Body()
    {
      email,
      name,
      avatarUrl,
    }: {
      email: string;
      name: string;
      avatarUrl?: string;
    },
  ) {
    const user = await this.usersService.findOrCreateUser(
      email,
      name,
      avatarUrl,
    );
    return user;
  }
}
