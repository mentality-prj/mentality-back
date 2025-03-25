import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { LIMIT, PAGE } from 'src/constants';

import { AffirmationsService } from './affirmations.service';
import { Affirmation } from './schemas/affirmation.schema';

@Controller('affirmations')
export class AffirmationsController {
  constructor(private readonly affirmationsService: AffirmationsService) {}

  // Generate and save an affirmation
  @Post('generate')
  async generateAffirmation() {
    return this.affirmationsService.generateAndSaveAffirmation();
  }

  // Get affirmations with pagination
  @Get()
  async getManyWithPagination(
    @Query('page', new ParseIntPipe()) page = PAGE,
    @Query('limit', new ParseIntPipe()) limit = LIMIT,
  ): Promise<{ data: Affirmation[]; total: number }> {
    const { data, total } =
      // Get affirmations with pagination
      await this.affirmationsService.getManyAffirmationsWithPagination(
        page,
        limit,
      );
    return { data, total };
  }

  // Update an affirmation's published status
  @Patch(':id/publish')
  async updateAffirmation(
    @Param('id') id: string,
    @Body() body: { isPublished: boolean },
  ): Promise<Affirmation> {
    // Update the affirmation's published status
    return this.affirmationsService.updateAffirmation(id, body.isPublished);
  }

  @Get()
  async getManyWithPagination(
    @Query('page', new ParseIntPipe()) page = PAGE,
    @Query('limit', new ParseIntPipe()) limit = LIMIT,
  ): Promise<{ data: Affirmation[]; total: number }> {
    const { data, total } =
      await this.affirmationsService.getManyAffirmationsWithPagination(
        page,
        limit,
      );
    return { data, total };
  }
}
