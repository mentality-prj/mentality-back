import { IsBoolean, IsNotEmpty, IsObject } from 'class-validator';

import { SupportedLanguage } from 'src/constants/supported-languages.constant';

export class UpdateTipDto {
  @IsObject()
  @IsNotEmpty()
  translations: Record<SupportedLanguage, string>;

  @IsBoolean()
  @IsNotEmpty()
  isPublished: boolean;
}
