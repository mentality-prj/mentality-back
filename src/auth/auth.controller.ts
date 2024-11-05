import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

import { ProviderType } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  private googleClient: OAuth2Client;

  constructor(private readonly usersService: UsersService) {
    this.googleClient = new OAuth2Client(process.env.AUTH_GOOGLE_ID);
  }

  @Post('validate-token')
  async validateToken(
    @Body('token') token: string,
    @Body('provider') provider: ProviderType,
  ) {
    try {
      let email: string | null = null;
      let name: string | null = null;
      let avatarUrl: string | null = null;
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

      // Find or create user in the database
      const user = await this.usersService.findOrCreateUser(
        email,
        name,
        avatarUrl,
        {
          type: provider,
          id: providerID,
        },
      );

      return user;
    } catch (error) {
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
