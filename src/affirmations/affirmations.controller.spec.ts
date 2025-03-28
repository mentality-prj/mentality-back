import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

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

  it('should return all stored affirmations', async () => {
    const mockAffirmations = [
      { text: 'Affirmation 1', imageUrl: 'https://picsum.photos/1000/1000' },
      { text: 'Affirmation 2', imageUrl: 'https://picsum.photos/1001/1001' },
    ];

    jest.spyOn(service, 'getManyAffirmationsWithPagination').mockResolvedValue({
      data: mockAffirmations as Affirmation[],
      total: mockAffirmations.length,
    });

    const result = await controller.getManyWithPagination(1, 10);
    expect(result.data).toEqual(mockAffirmations);
  });
});
