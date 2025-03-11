import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { SupportedLanguage } from 'src/constants/supported-languages.constant';

export class GenerateTipDto {
  @IsString()
  prompt: string;

  @IsString()
  lang: SupportedLanguage;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
