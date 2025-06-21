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

import { GenerateTipDto } from './dtos/generate-tip.dto';
import { UpdateTipDto } from './dtos/update-tip.dto';
import { NewTipEntity, TipEntity } from './entities/tip.entity';
import { TipsService } from './tips.service';

@ApiTags('Tips')
@Controller('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate a new tip' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tip successfully generated.',
    type: NewTipEntity,
  })
  async generateTip(
    @Body() generateTipDto: GenerateTipDto,
  ): Promise<NewTipEntity> {
    return this.tipsService.generateTip(generateTipDto, AI.OpenAI);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing tip' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tip successfully updated.',
    type: TipEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateTipDto,
  ): Promise<TipEntity> {
    return this.tipsService.updateTip(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing tip by ID' })
  async deleteOneById(@Param('id') id: string): Promise<boolean> {
    return this.tipsService.deleteTipById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get tips with pagination' })
  async getManyWithPagination(
    @Query('page', new ParseIntPipe()) page = PAGE,
    @Query('limit', new ParseIntPipe()) limit = LIMIT,
  ): Promise<{ data: TipEntity[]; total: number }> {
    const { data, total } = await this.tipsService.getManyTipsWithPagination(
      page,
      limit,
    );
    return { data, total };
  }

  @Get('unpublished')
  @ApiOperation({ summary: 'Get all unpablished tips' })
  async getAllUnpublished() {
    const unpublishedTips = await this.tipsService.getAllUnpublishedTips();
    return unpublishedTips;
  }
}
