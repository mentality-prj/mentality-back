import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { GamesService } from './games.service';
import { Games } from './schemas/games.schema';

describe('GamesService', () => {
  let service: GamesService;
  let model: Model<Games>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getModelToken(Games.name),
          useValue: {
            findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn() }),
          },
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    model = module.get<Model<Games>>(getModelToken(Games.name));
  });

  it('should update a game by ID', async () => {
    const mockGame = {
      _id: 'mocked_id',
      textGames: 'Mock Game',
      isPublished: true,
    } as Games;

    (model.findByIdAndUpdate as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockGame),
    });

    const result = await service.updateGames('mocked_id', true);

    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      'mocked_id',
      { isPublished: true },
      { new: true },
    );
    expect(result).toEqual(mockGame);
  });

  it('should throw an error if game is not found', async () => {
    (model.findByIdAndUpdate as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.updateGames('non_existing_id', true)).rejects.toThrow(
      'Game not found',
    );
  });
});
