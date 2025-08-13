import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { SupportedLanguages } from 'src/constants/supported-languages.constant';

export class GenerateAffirmationDto {
  @IsString()
  prompt: string;

  @IsString()
  lang: SupportedLanguages;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
