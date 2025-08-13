import { IsArray, IsBoolean, IsString } from 'class-validator';

export class CreateDiaryDto {
  @IsString()
  userId: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
