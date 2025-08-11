import { Test, TestingModule } from '@nestjs/testing';

import { AffirmationsController } from './affirmations.controller';
import { AffirmationsService } from './affirmations.service';
import { GenerateAffirmationDto, UpdateAffirmationDto } from './dtos';
import {
  AffirmationEntity,
  NewAffirmationEntity,
} from './entities/affirmation.entity';

describe('AffirmationsController', () => {
  let controller: AffirmationsController;
  let service: AffirmationsService;

  const mockAffirmation: AffirmationEntity = {
    id: '1',
    translations: {
      en: 'You are strong',
      uk: 'Ти сильний',
      pl: 'Jesteś silny',
    },
    isPublished: true,
    imageUrl: 'http://example.com/image1.jpg',
    createdAt: new Date(),
  };
  const mockNewAffirmation: NewAffirmationEntity = {
    id: '2',
    translations: {
      en: 'You are capable',
      uk: 'Ти сильний',
      pl: 'Jesteś silny',
    },
    isPublished: false,
    imageUrl: 'http://example.com/image.jpg',
    createdAt: new Date(),
  };
  const mockAffirmations = [
    {
      ...mockAffirmation,
      translations: {
        en: 'You are strong',
        uk: 'Ти сильний',
        pl: 'Jesteś silny',
      },
    },
    {
      ...mockNewAffirmation,
      translations: {
        en: 'You are capable',
        uk: 'Ти здатний',
        pl: 'Jesteś zdolny',
      },
    },
  ];

  const mockService = {
    generateAffirmation: jest.fn().mockResolvedValue(mockAffirmation),
    getManyAffirmationsWithPagination: jest
      .fn()
      .mockResolvedValue({ data: mockAffirmations, total: 2 }),
    getAllUnpublishedAffirmations: jest
      .fn()
      .mockResolvedValue([mockNewAffirmation]),
    updateAffirmation: jest.fn().mockResolvedValue(mockAffirmation),
    deleteAffirmationById: jest.fn().mockResolvedValue(true),
    generateImage: jest.fn().mockResolvedValue('http://image.url'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffirmationsController],
      providers: [{ provide: AffirmationsService, useValue: mockService }],
    }).compile();

    controller = module.get<AffirmationsController>(AffirmationsController);
    service = module.get<AffirmationsService>(AffirmationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateAffirmation', () => {
    it('should generate a new affirmation', async () => {
      const dto: GenerateAffirmationDto = { prompt: 'Be positive', lang: 'en' };
      const result = await controller.generateAffirmation(dto);
      expect(result).toEqual(mockAffirmation);
      expect(service.generateAffirmation).toHaveBeenCalledWith(
        dto,
        expect.anything(),
      );
    });
  });

  describe('getManyWithPagination', () => {
    const PAGE = 1;
    const PAGE_SIZE = 10;
    it('should return affirmations with pagination', async () => {
      const result = await controller.getManyWithPagination(PAGE, PAGE_SIZE);
      expect(result).toEqual({ data: mockAffirmations, total: 2 });
      expect(service.getManyAffirmationsWithPagination).toHaveBeenCalledWith(
        PAGE,
        PAGE_SIZE,
      );
    });
  });

  describe('getAllUnpublishedAffirmations', () => {
    it('should return all unpublished affirmations', async () => {
      const result = await controller.getAllUnpublishedAffirmations();
      expect(result).toEqual([mockNewAffirmation]);
      expect(service.getAllUnpublishedAffirmations).toHaveBeenCalled();
    });
  });

  describe('updateAffirmation', () => {
    it('should update an affirmation', async () => {
      const dto: UpdateAffirmationDto = {
        translations: {
          en: 'Updated text',
          uk: 'Оновлений текст',
          pl: 'Zaktualizowany tekst',
        },
        isPublished: true,
      };
      const result = await controller.updateAffirmation('1', dto);
      expect(result).toEqual(mockAffirmation);
      expect(service.updateAffirmation).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('deleteAffirmationById', () => {
    it('should delete an affirmation by id', async () => {
      const result = await controller.deleteAffirmationById('1');
      expect(result).toEqual({ success: true });
      expect(service.deleteAffirmationById).toHaveBeenCalledWith('1');
    });
  });

  describe('generateImage', () => {
    it('should generate an image for affirmation prompt', async () => {
      const dto: GenerateAffirmationDto = { prompt: 'Be creative', lang: 'en' };
      const result = await controller.generateImage(dto);
      expect(result).toEqual({ imageUrl: 'http://image.url' });
      expect(service.generateImage).toHaveBeenCalledWith(dto);
    });
  });
});
