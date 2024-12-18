import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, Validate } from 'class-validator';

import { IsValidMongoId } from 'src/helpers/validators/mongo-id.validator';

export class UpdateArticlesDto {
  @ApiProperty({
    description: 'articles`s ids',
    example: ['648a52d9fc13ae44e8000001', '648a52d9fc13ae44e8000002'],
  })
  @IsArray()
  @Validate(IsValidMongoId, { each: true })
  @Type(() => String)
  articleIds: string[];
}
