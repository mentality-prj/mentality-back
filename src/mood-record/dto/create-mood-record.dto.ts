import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { MOOD_MAX_LEVEL, MOOD_MIN_LEVEL } from 'src/constants';

export class CreateMoodRecordDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Min(MOOD_MIN_LEVEL)
  @Max(MOOD_MAX_LEVEL)
  moodLevel: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(MOOD_MIN_LEVEL)
  @Max(MOOD_MAX_LEVEL)
  stressLevel?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
