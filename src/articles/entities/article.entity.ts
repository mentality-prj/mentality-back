import { ApiProperty } from '@nestjs/swagger';

import { TagEntity } from 'src/tags/entities/tag.entity';

export class ArticleEntity {
  @ApiProperty({
    example: '648a52d9fc13ae44e8000001',
    description: 'Unique identifier of the article',
  })
  id: string;

  @ApiProperty({
    example: 'Cleaning',
    description: 'The title of the article',
  })
  title: string;

  @ApiProperty({
    example:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    description: 'The content of the article',
  })
  content: string;

  @ApiProperty({
    example: 'Innekto V.',
    description: 'The author of the article',
  })
  author?: string;

  @ApiProperty({
    type: [TagEntity],
    description: 'The name of the tag',
  })
  tags: TagEntity[];

  @ApiProperty({
    example: '2024-11-19T14:35:30.742Z',
    description: 'The date when the article was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-11-20T14:35:30.742Z',
    description: 'The date when the article was last updated',
  })
  updatedAt?: Date;
}
