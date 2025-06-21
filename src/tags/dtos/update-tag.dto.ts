import { IsDate, IsNotEmpty, IsObject, IsString } from 'class-validator';

import { SupportedLanguages } from 'src/constants/supported-languages.constant';

export class UpdateTagDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsObject()
  @IsNotEmpty()
  translations: Record<SupportedLanguages, string>;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
}
