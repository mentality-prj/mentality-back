import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Tag } from './schemas/tag.schema';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;

  const mockTagModel = {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([
        {
          _id: '1',
          name: 'Cleaning',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    }),
    findById: jest.fn((id) => ({
      exec: jest.fn().mockResolvedValue({
        _id: id,
        name: 'Cleaning',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    })),
    create: jest.fn((dto) => ({
      _id: '2',
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
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
      expect(tag.name).toBe('Cleaning');
      expect(mockTagModel.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('createTag', () => {
    it('should create a new tag', async () => {
      const newTag = await service.createTag('Gardening');
      expect(newTag.name).toBe('Gardening');
      expect(mockTagModel.create).toHaveBeenCalledWith({ name: 'Gardening' });
    });
  });
});
