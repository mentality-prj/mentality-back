import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { AffirmationsService } from './affirmations.service';
import { Affirmation } from './schemas/affirmation.schema';

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

  @Patch(':id/publish')
  async updateAffirmation(
    @Param('id') id: string,
    @Body() body: { isPublished: boolean },
  ): Promise<Affirmation> {
    return this.affirmationsService.updateAffirmation(id, body.isPublished);
  }
}
