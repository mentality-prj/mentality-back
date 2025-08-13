import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AI, LIMIT, PAGE } from 'src/constants';

import { AffirmationsService } from './affirmations.service';
import { GenerateAffirmationDto, UpdateAffirmationDto } from './dtos';
import {
  AffirmationEntity,
  NewAffirmationEntity,
} from './entities/affirmation.entity';

@ApiTags('Affirmations')
@Controller('affirmations')
export class AffirmationsController {
  constructor(private readonly affirmationsService: AffirmationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate a new affirmation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Affirmation successfully generated.',
    type: NewAffirmationEntity,
  })
  async generateAffirmation(
    @Body() generateAffirmationDto: GenerateAffirmationDto,
  ): Promise<AffirmationEntity> {
    return this.affirmationsService.generateAffirmation(
      generateAffirmationDto,
      AI.OpenAI,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get affirmations with pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of affirmations with total count',
  })
  async getManyWithPagination(
    @Query('page', new ParseIntPipe()) page = PAGE,
    @Query('limit', new ParseIntPipe()) limit = LIMIT,
  ): Promise<{ data: AffirmationEntity[]; total: number }> {
    return this.affirmationsService.getManyAffirmationsWithPagination(
      page,
      limit,
    );
  }

  @Get('unpublished')
  @ApiOperation({ summary: 'Get all unpublished affirmations' })
  @ApiResponse({ status: HttpStatus.OK, type: [AffirmationEntity] })
  async getAllUnpublishedAffirmations(): Promise<AffirmationEntity[]> {
    return this.affirmationsService.getAllUnpublishedAffirmations();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an affirmation' })
  @ApiResponse({ status: HttpStatus.OK, type: AffirmationEntity })
  async updateAffirmation(
    @Param('id') id: string,
    @Body() updateAffirmationDto: UpdateAffirmationDto,
  ): Promise<AffirmationEntity> {
    return this.affirmationsService.updateAffirmation(id, updateAffirmationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an affirmation by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success status' })
  async deleteAffirmationById(
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    const success = await this.affirmationsService.deleteAffirmationById(id);
    return { success };
  }

  @Post('generate-image')
  @ApiOperation({ summary: 'Generate an image for affirmation prompt' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Generated image URL',
  })
  async generateImage(
    @Body() generateAffirmationDto: GenerateAffirmationDto,
  ): Promise<{ imageUrl: string }> {
    const imageUrl = await this.affirmationsService.generateImage(
      generateAffirmationDto,
    );
    return { imageUrl };
  }
}
