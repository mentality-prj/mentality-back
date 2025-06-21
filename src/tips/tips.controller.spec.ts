import { AI } from 'src/constants';

import { SUPPORTED_LANGUAGES } from './../constants/supported-languages.constant';
import { TipsController } from './tips.controller';
import { TipsService } from './tips.service';

const generateTipDto = {
  lang: SUPPORTED_LANGUAGES.ENG,
  prompt: 'Test tip',
};

const generateTip = {
  id: '1',
  content: 'Test tip',
  isPublished: false,
  translations: {
    en: 'Test tip',
    uk: 'Тестовий підказка',
    pl: 'Testowa wskazówka',
  },
  createdAt: new Date(),
};

const updateTipDto = {
  lang: SUPPORTED_LANGUAGES.ENG,
  prompt: 'Updated test tip',
  translations: {
    en: 'Updated test tip',
    uk: 'Оновлений тестовий підказка',
    pl: 'Zaktualizowana wskazówka testowa',
  },
  isPublished: false,
};

describe('TipsController', () => {
  let tipsController: TipsController;
  let tipsService: TipsService;

  beforeEach(() => {
    tipsService = {
      generateTip: jest.fn(),
      updateTip: jest.fn(),
      deleteTipById: jest.fn(),
      getManyTipsWithPagination: jest.fn(),
      getAllUnpublishedTips: jest.fn(),
    } as unknown as TipsService;

    tipsController = new TipsController(tipsService);
  });

  describe('generateTip', () => {
    it('should call tipsService.generateTip and return the result', async () => {
      jest.spyOn(tipsService, 'generateTip').mockResolvedValue(generateTip);

      const response = await tipsController.generateTip(generateTipDto);

      expect(tipsService.generateTip).toHaveBeenCalledWith(
        generateTipDto,
        AI.OpenAI,
      );
      expect(response).toEqual(generateTip);
    });
  });

  describe('update', () => {
    it('should call tipsService.updateTip and return the updated tip', async () => {
      const id = '1';
      jest.spyOn(tipsService, 'updateTip').mockResolvedValue(generateTip);

      const response = await tipsController.update(id, updateTipDto);

      expect(tipsService.updateTip).toHaveBeenCalledWith(id, updateTipDto);
      expect(response).toEqual(generateTip);
    });
  });

  describe('deleteOneById', () => {
    it('should call tipsService.deleteTipById and return true', async () => {
      const id = '1';
      jest.spyOn(tipsService, 'deleteTipById').mockResolvedValue(true);

      const response = await tipsController.deleteOneById(id);

      expect(tipsService.deleteTipById).toHaveBeenCalledWith(id);
      expect(response).toBe(true);
    });
  });

  describe('getManyWithPagination', () => {
    it('should call tipsService.getManyTipsWithPagination and return paginated tips', async () => {
      const page = 1;
      const limit = 10;
      const result = { data: [generateTip], total: 1 };
      jest
        .spyOn(tipsService, 'getManyTipsWithPagination')
        .mockResolvedValue(result);

      const response = await tipsController.getManyWithPagination(page, limit);

      expect(tipsService.getManyTipsWithPagination).toHaveBeenCalledWith(
        page,
        limit,
      );
      expect(response).toEqual(result);
    });
  });

  describe('getAllUnpublished', () => {
    it('should call tipsService.getAllUnpublishedTips and return unpublished tips', async () => {
      const result = [generateTip];
      jest
        .spyOn(tipsService, 'getAllUnpublishedTips')
        .mockResolvedValue(result);

      const response = await tipsController.getAllUnpublished();

      expect(tipsService.getAllUnpublishedTips).toHaveBeenCalled();
      expect(response).toEqual(result);
    });
  });
});
