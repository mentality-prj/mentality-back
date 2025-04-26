import { ApiProperty } from '@nestjs/swagger';

export class AffirmationEntity {
  @ApiProperty({
    example: '648a52d9fc13ae44e8000001',
    description: 'Unique identifier of the affirmation',
  })
  id: string;

  @ApiProperty({
    description: 'The text of the affirmation',
    example: 'You are capable of amazing things.',
  })
  text: string;

  @ApiProperty({
    description: 'The URL of the image associated with the affirmation',
    example: 'https://example.com/image.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Indicates whether the affirmation is published',
    example: true,
  })
  isPublished: boolean;

  @ApiProperty({
    description: 'The date the affirmation was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
