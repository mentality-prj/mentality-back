import { Controller, Get, Post } from '@nestjs/common';

import { AffirmationsService } from './affirmations.service';

@Controller('affirmations')
export class AffirmationsController {
  constructor(private readonly affirmationsService: AffirmationsService) {}

  @Post('generate')
  async generateAffirmation() {
    return this.affirmationsService.generateAndSaveAffirmation();
  }

  @Get()
  async getAllAffirmations() {
    return this.affirmationsService.getAllAffirmations();
  }
}
