import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { SupportedLanguage } from 'src/constants/supported-languages.constant';

import { Tag } from './schemas/tag.schema';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;

  const mockTagModel = {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([
        {
          _id: '1',
          key: 'cleaning',
          translations: {
            en: 'Cleaning',
            uk: 'Прибирання',
            pl: 'Sprzątanie',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    }),
    findById: jest.fn((id: string) => ({
      exec: jest.fn().mockResolvedValue({
        _id: id,
        key: 'cleaning',
        translations: {
          en: 'Cleaning',
          uk: 'Прибирання',
          pl: 'Sprzątanie',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    })),
    create: jest.fn(
      (dto: {
        key: string;
        translations: Record<SupportedLanguage, string>;
      }) => ({
        _id: '2',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: getModelToken(Tag.name), useValue: mockTagModel },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTags', () => {
    it('should return all tags', async () => {
      const tags = await service.getAllTags();
      expect(tags).toHaveLength(1);
      expect(mockTagModel.find).toHaveBeenCalled();
    });
  });

  describe('getTagById', () => {
    it('should return a tag by id', async () => {
      const tag = await service.getTagById('1');
      expect(tag.translations.en).toBe('Cleaning');
      expect(mockTagModel.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('createTag', () => {
    it('should create a new tag', async () => {
      const newTag = await service.createTag({
        key: 'gardening',
        translations: {
          en: 'Gardening',
          uk: 'Садівництво',
          pl: 'Ogrodnictwo',
        },
      });
      expect(newTag.translations.en).toBe('Gardening');
      expect(mockTagModel.create).toHaveBeenCalledWith({
        key: 'gardening',
        translations: {
          en: 'Gardening',
          uk: 'Садівництво',
          pl: 'Ogrodnictwo',
        },
      });
    });
  });
});
