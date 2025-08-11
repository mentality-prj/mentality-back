import { Module } from '@nestjs/common';

import { HuggingFaceModule } from 'src/huggingface/huggingface.module';

import { TranslationsService } from './translations.service';

@Module({
  imports: [HuggingFaceModule],
  providers: [TranslationsService],
  exports: [TranslationsService],
})
export class TranslationsModule {}
