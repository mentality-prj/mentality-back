import { IsString } from 'class-validator';

import { ProviderType } from '../schemas/user.schema';

export class ValidateUserDto {
  @IsString()
  token: string;

  @IsString()
  provider: ProviderType;
}
