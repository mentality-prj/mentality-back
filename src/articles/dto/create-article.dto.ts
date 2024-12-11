import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, Validate } from 'class-validator';

import { IsValidMongoId } from 'src/helpers/validators/mongo-id.validator';

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({
    description: 'tag`s ids',
    example: ['648a52d9fc13ae44e8000001', '648a52d9fc13ae44e8000001'],
  })
  @IsOptional()
  @IsArray()
  @Validate(IsValidMongoId, { each: true })
  @Type(() => String)
  tags?: string[];
}
