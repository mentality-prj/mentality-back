import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { SupportedLanguage } from 'src/constants/supported-languages.constant';

export class GenerateTipDto {
  @IsOptional()
  @IsString()
  prompt?: string;

  @IsOptional()
  @IsString()
  lang?: SupportedLanguage;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
