import { IsBoolean, IsNotEmpty, IsObject } from 'class-validator';

import { SupportedLanguages } from 'src/constants/supported-languages.constant';

export class UpdateAffirmationDto {
  @IsObject()
  @IsNotEmpty()
  translations: Record<SupportedLanguages, string>;

  @IsBoolean()
  @IsNotEmpty()
  isPublished: boolean;
}
