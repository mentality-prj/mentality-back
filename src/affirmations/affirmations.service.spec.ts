import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { MockOpenAIService } from './__mock__/mock-openai.service';
import { AffirmationsService } from './affirmations.service';
import { Affirmation } from './schemas/affirmation.schema';

describe('AffirmationsService', () => {
  let service: AffirmationsService;
  let model: Model<Affirmation>;
  let mockOpenAIService: MockOpenAIService;

  beforeEach(async () => {
    mockOpenAIService = new MockOpenAIService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AffirmationsService,
        {
          provide: getModelToken(Affirmation.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn().mockReturnValue({
              sort: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              exec: jest.fn(),
            }),
            countDocuments: jest.fn().mockReturnValue({
              exec: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AffirmationsService>(AffirmationsService);
    model = module.get<Model<Affirmation>>(getModelToken(Affirmation.name));

    (service as any).openAIService = mockOpenAIService;
  });

  it('should return all affirmations with pagination', async () => {
    const mockAffirmations = {
      imageUrl: mockOpenAIService.generateImage(''),
    };

    (model.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockAffirmations),
    });

    (model.countDocuments as jest.Mock).mockReturnValue({
      exec: jest.fn().mockReturnThis(),
    });

    const result = await service.getManyAffirmationsWithPagination();

    expect(result.data).toEqual({
      imageUrl: 'https://picsum.photos/1478/1478',
    });
  });
});
