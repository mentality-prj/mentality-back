import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { MockOpenAIGameRulesService } from './__mock__/mock-openai.service';
import { GamesService } from './games.service';
import { Games } from './schemas/games.schema';

describe('GamesService', () => {
  let service: GamesService;
  let mockOpenAIService: MockOpenAIGameRulesService;

  beforeEach(async () => {
    mockOpenAIService = new MockOpenAIGameRulesService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getModelToken(Games.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn().mockReturnValue({
              sort: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              exec: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);

    (service as any).openAIService = mockOpenAIService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
