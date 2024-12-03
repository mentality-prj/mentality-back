import { Test, TestingModule } from '@nestjs/testing';

import { TagEntity } from './entities/tag.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  const mockTags: TagEntity[] = [
    {
      id: '1',
      name: 'Cleaning',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockTagsService = {
    getAllTags: jest.fn().mockResolvedValue(mockTags),
    getTagById: jest.fn((id: string) => mockTags.find((tag) => tag.id === id)),
    createTag: jest.fn((name: string) => ({
      id: '2',
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [{ provide: TagsService, useValue: mockTagsService }],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllTags', () => {
    it('should return an array of tags', async () => {
      expect(await controller.getAllTags()).toEqual(mockTags);
      expect(service.getAllTags).toHaveBeenCalled();
    });
  });

  describe('getTagById', () => {
    it('should return a tag by id', async () => {
      const tag = await controller.getTagById('1');
      expect(tag).toEqual(mockTags[0]);
      expect(service.getTagById).toHaveBeenCalledWith('1');
    });
  });

  describe('createTag', () => {
    it('should create a new tag', async () => {
      const newTag = await controller.createTag('Gardening');
      expect(newTag.name).toBe('Gardening');
      expect(service.createTag).toHaveBeenCalledWith('Gardening');
    });
  });
});
