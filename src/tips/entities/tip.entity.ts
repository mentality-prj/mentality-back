import { ApiProperty } from '@nestjs/swagger';

import { SupportedLanguage } from 'src/constants/supported-languages.constant';

export class TipEntity {
  @ApiProperty({
    example: '648a52d9fc13ae44e8000001',
    description: 'Unique identifier of the tip',
  })
  id: string;

  @ApiProperty({
    example: true,
    description: 'Shows whether the tip has been published',
  })
  isPublished: boolean;

  @ApiProperty({
    example: {
      en: 'Cleaning',
      uk: 'Прибирання',
      pl: 'Sprzątanie',
    },
    description: 'Translations for the tip in supported languages',
  })
  content: Record<SupportedLanguage, string>;

  @ApiProperty({
    example: '2024-11-19T14:35:30.742Z',
    description: 'The date when the tip was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-11-20T14:35:30.742Z',
    description: 'The date when the tip was last updated',
  })
  updatedAt?: Date;
}

export class NewTipEntity {
  @ApiProperty({
    example: '648a52d9fc13ae44e8000001',
    description: 'Unique identifier of the tip',
  })
  id: string;

  @ApiProperty({
    example: false,
    description: 'Shows whether the tip has been published',
  })
  isPublished: boolean;

  @ApiProperty({
    example: {
      en: 'Cleaning',
      uk: 'Прибирання',
      pl: 'Sprzątanie',
    },
    description: 'Translations for the tip in various languages',
  })
  content: Record<SupportedLanguage, string>;

  @ApiProperty({
    example: '2024-11-19T14:35:30.742Z',
    description: 'The date when the tip was created',
  })
  createdAt: Date;
}
