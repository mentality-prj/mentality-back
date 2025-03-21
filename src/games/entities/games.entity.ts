import { ApiProperty } from '@nestjs/swagger';

export class GamesEntity {
  @ApiProperty({
    type: Object,
    description: 'An object containing game text data',
    example: { game1: 'Chess', game2: 'Poker' },
  })
  textGames: Record<string, any>;

  @ApiProperty({
    type: Boolean,
    description: 'Indicates whether the game is published',
    example: true,
  })
  isPublished: boolean;

  @ApiProperty({
    type: Date,
    description: 'The date when the game was created',
    example: '2024-03-20T12:00:00.000Z',
  })
  createdAt: Date;
}
