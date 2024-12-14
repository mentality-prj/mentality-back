import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, Validate } from 'class-validator';

import { IsValidMongoId } from 'src/helpers/validators/mongo-id.validator';

import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @ApiProperty({
    description: 'tag`s ids',
    example: ['648a52d9fc13ae44e8000001', '648a52d9fc13ae44e8000002'],
  })
  @IsOptional()
  @IsArray()
  @Validate(IsValidMongoId, { each: true })
  @Type(() => String)
  tagsToRemove?: string[];
}
