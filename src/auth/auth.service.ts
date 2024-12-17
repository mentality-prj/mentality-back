import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

import { ValidateUserDto } from 'src/users/dto/validate-token-dto';
import { Provider, Roles, UserRole } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(private readonly usersService: UsersService) {
    this.googleClient = new OAuth2Client(process.env.AUTH_GOOGLE_ID);
  }

  async validateToken(validateUserDto: ValidateUserDto) {
    const { token, provider } = validateUserDto;

    let email: string | null = null;
    let name: string | null = null;
    let avatarUrl: string | null = null;
    const role: UserRole = Roles.USER;
    let providerID: string | null = null;

    if (provider === 'google') {
      const {
        email: googleEmail,
        name: googleName,
        avatar,
        id,
      } = await this.verifyGoogleToken(token);
      email = googleEmail;
      name = googleName;
      avatarUrl = avatar;
      providerID = id;
    } else if (provider === 'github') {
      const {
        email: githubEmail,
        name: githubName,
        avatar,
        id,
      } = await this.verifyGithubToken(token);
      email = githubEmail;
      name = githubName;
      avatarUrl = avatar;
      providerID = id;
    } else {
      throw new UnauthorizedException('Unsupported provider');
    }

    if (!email) {
      throw new UnauthorizedException('Email not provided by OAuth provider');
    }

    const providers: Provider[] = [
      {
        type: provider,
        id: providerID,
      },
    ];

    const result = await this.usersService.findOrCreateUser(
      email,
      name,
      avatarUrl,
      role,
      providers,
    );

    return result;
  }

  private async verifyGoogleToken(token: string) {
    // Verify Google token
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.AUTH_GOOGLE_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException('Invalid Google token');
    }

    return {
      email: payload.email,
      name: payload.name || null,
      avatar: payload.picture || null,
      id: payload.sub || null,
    };
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
    const emailResponse = await axios.get(
      'https://api.github.com/user/emails',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Get primary email if needed
    const primaryEmail = emailResponse.data.find(
      (email: { email: string; primary: boolean }) => email.primary,
    )?.email;

    return {
      email: primaryEmail,
      name: response.data.name || null,
      avatar: response.data.avatar_url || null,
      id: response.data.id || null,
    };
  }
}
