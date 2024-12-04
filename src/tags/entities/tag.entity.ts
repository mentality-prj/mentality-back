import { ApiProperty } from '@nestjs/swagger';

export class TagEntity {
  @ApiProperty({
    example: '648a52d9fc13ae44e8000001',
    description: 'Unique identifier of the tag',
  })
  id: string;

  @ApiProperty({
    example: 'Cleaning',
    description: 'The name of the tag',
  })
  name: string;

  @ApiProperty({
    example: '2024-11-19T14:35:30.742Z',
    description: 'The date when the tag was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-11-20T14:35:30.742Z',
    description: 'The date when the tag was last updated',
  })
  updatedAt?: Date;
}

export class NewTagEntity {
  @ApiProperty({
    example: '648a52d9fc13ae44e8000001',
    description: 'Unique identifier of the tag',
  })
  id: string;

  @ApiProperty({
    example: 'Cleaning',
    description: 'The name of the tag',
  })
  name: string;

  @ApiProperty({
    example: '2024-11-19T14:35:30.742Z',
    description: 'The date when the tag was created',
  })
  createdAt: Date;
}
