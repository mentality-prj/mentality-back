import { Provider } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ProviderName, Roles } from '../schemas/user.schema';

export class ValidateUser {
  @ApiProperty({
    example: 'xxxxx.yyyyy.zzzzz',
    description: 'User token',
  })
  token: string;

  @ApiProperty({
    example: 'google',
    description: 'OAuth provider',
  })
  provider: ProviderName;
}

export class UserEntity {
  @ApiProperty({
    example: 'JohnDoe@gmail.com',
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
  })
  name: string;

  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a/1DRdbqBzgza4Q-5tZfdvNGoCg8ocL_lRl',
    description: 'User avatar url',
  })
  avatarUrl: string;

  @ApiProperty({
    example: Roles.USER,
    description: 'User role',
  })
  role: string;

  @ApiProperty({
    example: [
      {
        type: 'google',
        id: 'google_id',
        _id: 'MongoDB_id',
      },
      {
        type: 'github',
        id: 'github_id',
        _id: 'MongoDB_id',
      },
    ],
    description: 'User providers',
  })
  providers: Provider[];

  @ApiProperty({
    example: '2024-11-19T14:35:30.742Z',
    description: 'User creation date',
  })
  createdAt: Date;
}

export class NewUserEntity {
  @ApiProperty({
    example: 'JohnDoe@gmail.com',
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
  })
  name: string;

  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a/1DRdbqBzgza4Q-5tZfdvNGoCg8ocL_lRl',
    description: 'User avatar url',
  })
  avatarUrl: string;

  @ApiProperty({
    example: Roles.USER,
    description: 'User role',
  })
  role: string;

  @ApiProperty({
    example: [
      {
        type: 'google',
        id: 'google_id',
        _id: 'MongoDB_id',
      },
    ],
    description: 'User providers',
  })
  providers: Provider[];

  @ApiProperty({
    example: '2024-11-19T14:35:30.742Z',
    description: 'User creation date',
  })
  createdAt: Date;
}

export class UnauthorizedUser {
  @ApiProperty({
    example: 'Token validation failed',
    description: 'Error message',
  })
  message: string;

  @ApiProperty({
    example: 'Unauthorized',
    description: 'Error message',
  })
  error: string;

  @ApiProperty({
    example: 401,
    description: 'Error message',
  })
  statusCode: number;
}
