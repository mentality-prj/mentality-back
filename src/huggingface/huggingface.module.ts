import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { HuggingFaceService } from './huggingface.service';

@Module({
  imports: [HttpModule],
  providers: [HuggingFaceService],
  exports: [HuggingFaceService],
})
export class HuggingFaceModule {}
