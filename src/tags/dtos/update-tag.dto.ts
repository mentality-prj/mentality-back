import { IsDate, IsNotEmpty, IsObject, IsString } from 'class-validator';

import { SupportedLanguage } from 'src/constants/supported-languages.constant';

export class UpdateTagDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsObject()
  @IsNotEmpty()
  translations: Record<SupportedLanguage, string>;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
}
