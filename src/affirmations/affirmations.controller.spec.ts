import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { MockOpenAIService } from './__mock__/mock-openai.service';
import { AffirmationsController } from './affirmations.controller';
import { AffirmationsService } from './affirmations.service';
import { Affirmation } from './schemas/affirmation.schema';

describe('AffirmationsController', () => {
  let controller: AffirmationsController;
  let service: AffirmationsService;

  const mockAffirmationModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffirmationsController],
      providers: [
        AffirmationsService,
        {
          provide: getModelToken(Affirmation.name),
          useValue: mockAffirmationModel,
        },
      ],
    }).compile();

    controller = module.get<AffirmationsController>(AffirmationsController);
    service = module.get<AffirmationsService>(AffirmationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should generate and return a new affirmation', async () => {
    const mockOpenAIService = new MockOpenAIService();
    const text = mockOpenAIService.generateAffirmationText();
    const imageUrl = mockOpenAIService.generateImage(text);
    const mockAffirmation = { text, imageUrl };

    jest
      .spyOn(service, 'generateAndSaveAffirmation')
      .mockResolvedValue(mockAffirmation as Affirmation);

    const result = await controller.generateAffirmation();
    expect(result).toEqual(mockAffirmation);
  });

  it('should return all stored affirmations', async () => {
    const mockAffirmations = [
      { text: 'Affirmation 1', imageUrl: 'https://picsum.photos/1000/1000' },
      { text: 'Affirmation 2', imageUrl: 'https://picsum.photos/1001/1001' },
    ];

    jest
      .spyOn(service, 'getAllAffirmations')
      .mockResolvedValue(mockAffirmations as Affirmation[]);

    const result = await controller.getAllAffirmations();
    expect(result).toEqual(mockAffirmations);
  });
});
