import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

import { SupportedLanguages } from 'src/constants/supported-languages.constant';

export class UpdateAffirmationDto {
  @IsOptional()
  @IsObject()
  translations?: Record<SupportedLanguages, string>;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
