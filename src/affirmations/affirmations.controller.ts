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
// Controller for handling routes related to affirmations
export class AffirmationsController {
  constructor(private readonly affirmationsService: AffirmationsService) {}

  @Post('generate')
  // Endpoint to generate and save a new affirmation
  async generateAffirmation() {
    return this.affirmationsService.generateAndSaveAffirmation();
  }

  @Get()
  // Endpoint to fetch affirmations with pagination
  async getManyWithPagination(
    // Extract 'page' query parameter, default to PAGE constant if not provided
    @Query('page', new ParseIntPipe()) page = PAGE,
    // Extract 'limit' query parameter, default to LIMIT constant if not provided
    @Query('limit', new ParseIntPipe()) limit = LIMIT,
  ): Promise<{ data: Affirmation[]; total: number }> {
    // Fetch paginated affirmations and total count from the service
    const { data, total } =
      await this.affirmationsService.getManyAffirmationsWithPagination(
        page,
        limit,
      );
    // Return the data and total count
    return { data, total };
  }

  @Patch(':id/publish')
  // Endpoint to update the 'isPublished' status of an affirmation
  async updateAffirmation(
    // Extract 'id' parameter from the route
    @Param('id') id: string,
    // Extract 'isPublished' field from the request body
    @Body() body: { isPublished: boolean },
  ): Promise<Affirmation> {
    // Update the affirmation's 'isPublished' status using the service
    return this.affirmationsService.updateAffirmation(id, body.isPublished);
  }
}
