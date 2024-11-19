import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import axios from 'axios';
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

import { ValidateUserDto } from 'src/users/dto/validate-token-dto';
import {
  NewUserEntity,
  UnauthorizedUser,
  UserEntity,
  ValidateUser,
} from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  private googleClient: OAuth2Client;

  constructor(private readonly usersService: UsersService) {
    this.googleClient = new OAuth2Client(process.env.AUTH_GOOGLE_ID);
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Verify users token. Find user by email or create new user in the database',
  })
  @ApiBody({
    description: 'User token and OAuth provider',
    type: ValidateUser,
  })
  @ApiAcceptedResponse({
    description: 'Token accepted, user found',
    type: UserEntity,
  })
  @ApiCreatedResponse({
    description: 'Token accepted, user created',
    type: NewUserEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedUser,
  })
  async validateToken(
    @Res() res: Response,
    @Body() validateUserDto: ValidateUserDto,
  ) {
    const { token, provider } = validateUserDto;

    try {
      let email: string | null = null;
      let name: string | null = null;
      let avatarUrl: string | null = null;
      const role: UserRole = 'user';
      let providerID: string | null = null;

      if (provider === 'google') {
        // Verify Google token
        const ticket = await this.googleClient.verifyIdToken({
          idToken: token,
          audience: process.env.AUTH_GOOGLE_ID,
        });
        const payload = ticket.getPayload();

        if (!payload) {
          throw new UnauthorizedException('Invalid Google token');
        }

        email = payload.email;
        name = payload.name || null;
        avatarUrl = payload.picture || null;
        providerID = payload.sub || null;
      } else if (provider === 'github') {
        // Verify GitHub token
        const githubUser = await this.verifyGithubToken(token);
        email = githubUser.email;
        name = githubUser.name || null;
        avatarUrl = githubUser.avatar_url || null;
        providerID = githubUser.id || null;
      } else {
        throw new UnauthorizedException('Unsupported provider');
      }

      if (!email) {
        throw new UnauthorizedException('Email not provided by OAuth provider');
      }

      const providers = [
        {
          type: provider,
          id: providerID,
        },
      ];

      // Find or create user in the database
      const { user, isNewUser } = await this.usersService.findOrCreateUser(
        email,
        name,
        avatarUrl,
        role,
        providers,
      );

      console.log('Token validation successful!');

      // statusCode: isNewUser ? HttpStatus.CREATED : HttpStatus.ACCEPTED,
      if (isNewUser) {
        res.status(HttpStatus.CREATED).json(user).send();
      } else {
        res.status(HttpStatus.ACCEPTED).json(user).send();
      }
    } catch (error) {
      // debt: add logger
      console.log('error', error);
      throw new UnauthorizedException('Token validation failed');
    }
  }

  private async verifyGithubToken(token: string) {
    // Call GitHub API to get user info
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      throw new UnauthorizedException('Invalid GitHub token');
    }

    // GitHub API does not include the user's email by default; another call may be necessary if needed
    const user = response.data;

    // Get primary email if needed
    const emailResponse = await axios.get(
      'https://api.github.com/user/emails',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const primaryEmail = emailResponse.data.find(
      (email: { email: string; primary: boolean }) => email.primary,
    )?.email;

    return { ...user, email: primaryEmail };
  }
}
