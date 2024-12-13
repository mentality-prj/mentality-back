import { IsOptional, IsString } from 'class-validator';

import { SupportedLanguage } from 'src/constants/supported-languages.constant';

export class GenerateTipDto {
  @IsOptional()
  @IsString()
  prompt?: string;
  lang?: SupportedLanguage;
  isPublished?: boolean;
}
