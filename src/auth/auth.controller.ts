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
import { Response } from 'express';

import { ValidateUserDto } from 'src/users/dto/validate-token-dto';
import {
  NewUserEntity,
  UnauthorizedUser,
  UserEntity,
} from 'src/users/entities/user.entity';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Verify users token. Find user by email or create new user in the database',
  })
  @ApiBody({
    description: 'User token and OAuth provider',
    type: ValidateUserDto,
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
    try {
      const { user, isNewUser } =
        await this.authService.validateToken(validateUserDto);

      // statusCode: isNewUser ? HttpStatus.CREATED : HttpStatus.ACCEPTED,
      if (isNewUser) {
        res.status(HttpStatus.CREATED).json(user).send();
      } else {
        res.status(HttpStatus.ACCEPTED).json(user).send();
      }
      console.log('Token validation successful!');
    } catch (error) {
      // debt: add logger
      console.log('error', error);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
