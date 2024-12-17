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

import { LIMIT, PAGE } from 'src/constants';

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
    status: 201,
    description: 'Tip successfully generated.',
    type: NewTipEntity,
  })
  async generateTip(
    @Body() generateTipDto: GenerateTipDto,
  ): Promise<NewTipEntity> {
    return this.tipsService.generateTip(generateTipDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate a new tip' })
  @ApiResponse({
    status: 200,
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
  async deleteOneById(@Param('id') id: string): Promise<boolean> {
    return this.tipsService.deleteTipById(id);
  }

  @Get()
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

  @Get()
  async getAllUnpublished() {
    const unpublishedTips = await this.tipsService.getAllUnpublishedTips();
    return unpublishedTips;
  }
}
