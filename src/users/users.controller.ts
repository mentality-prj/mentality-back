import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { User } from './schemas/user.schema';
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

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User Found' })
  @ApiResponse({ status: 404, description: 'User Not Found' })
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }
}
