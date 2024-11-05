import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  private client: OAuth2Client;

  constructor(private readonly usersService: UsersService) {
    this.client = new OAuth2Client(process.env.AUTH_GOOGLE_ID);
  }

  @Post('validate-token')
  async validateToken(@Body('token') token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.AUTH_GOOGLE_ID,
      });
      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.usersService.findOrCreateUser(
        payload.email,
        payload.name,
        payload.picture,
      );

      return user;
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
