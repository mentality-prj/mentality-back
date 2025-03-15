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

  it('should generate and save an affirmation', async () => {
    const mockAffirmation = {
      text: mockOpenAIService.generateAffirmationText(),
      imageUrl: mockOpenAIService.generateImage(''),
      createdAt: new Date(),
      _id: 'mocked_id',
    };

    (model.create as jest.Mock).mockResolvedValue(mockAffirmation);

    const result = await service.generateAndSaveAffirmation();

    expect(model.create).toHaveBeenCalledWith(
      expect.objectContaining({
        text: mockAffirmation.text,
        imageUrl: mockAffirmation.imageUrl,
      }),
    );

    expect(result).toMatchObject(mockAffirmation);
  });

  it('should return all affirmations', async () => {
    const mockAffirmations = mockOpenAIService
      .getMockAffirmations()
      .map((text, index) => ({
        _id: `mocked_id_${index}`,
        text,
        imageUrl: `https://picsum.photos/200/300?random=${index}`,
        createdAt: new Date(),
      }));

    (model.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockAffirmations),
    });

    const result = await service.getAllAffirmations();

    expect(result).toEqual(mockAffirmations);
  });
});
