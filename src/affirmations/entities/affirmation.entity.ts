import { ApiProperty } from '@nestjs/swagger';

import { SupportedLanguages } from 'src/constants/supported-languages.constant';

export class NewAffirmationEntity {
  @ApiProperty({
    example: '648a52d9fc13ae44e8000001',
    description: 'Unique identifier of the affirmation',
  })
  id: string;

  @ApiProperty({
    description: 'Indicates whether the affirmation is published',
    example: true,
  })
  isPublished: boolean;

  @ApiProperty({
    example: {
      en: 'I am strong.',
      uk: 'Я сильний.',
      pl: 'Jestem silny.',
    },
    description: 'Translations for the affirmation in various languages',
  })
  translations: Record<SupportedLanguages, string>;

  @ApiProperty({
    description: 'The URL of the image associated with the affirmation',
    example: 'https://example.com/image.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'The date the affirmation was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}

export class AffirmationEntity {
  id: string;
  translations: Record<SupportedLanguages, string>;
  isPublished: boolean;
  imageUrl: string;
  createdAt: Date;
}
