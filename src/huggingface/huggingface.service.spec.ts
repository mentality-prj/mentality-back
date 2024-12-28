import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { HuggingFaceService } from './huggingface.service';

describe('HuggingFaceService', () => {
  let service: HuggingFaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [HuggingFaceService],
    }).compile();

    service = module.get<HuggingFaceService>(HuggingFaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
