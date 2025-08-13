import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDiaryDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
