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
import { AffirmationEntity } from './entities/affirmation.entity';

@Controller('affirmations')
export class AffirmationsController {
  constructor(private readonly affirmationsService: AffirmationsService) {}

  @Post('generate')
  async generateAffirmation() {
    return this.affirmationsService.generateAndSaveAffirmation();
  }

  @Get()
  async getManyWithPagination(
    @Query('page', new ParseIntPipe()) page = PAGE,
    @Query('limit', new ParseIntPipe()) limit = LIMIT,
  ): Promise<{ data: AffirmationEntity[]; total: number }> {
    const { data, total } =
      // Get affirmations with pagination
      await this.affirmationsService.getManyAffirmationsWithPagination(
        page,
        limit,
      );
    return { data, total };
  }

  @Patch(':id/publish')
  async updateAffirmation(
    @Param('id') id: string,
    @Body() body: { isPublished: boolean },
  ): Promise<AffirmationEntity> {
    return this.affirmationsService.updateAffirmation(id, body.isPublished);
  }
}
