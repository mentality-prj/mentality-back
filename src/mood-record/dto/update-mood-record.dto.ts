import { IsBoolean, IsString } from 'class-validator';

export class UpdateMoodRecordDto {
  @IsString()
  userId: string;

  @IsBoolean()
  active: boolean;
}
