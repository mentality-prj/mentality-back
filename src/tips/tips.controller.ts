import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GenerateTipDto } from './dtos/generate-tip.dto';
import { NewTipEntity } from './entities/tip.entity';
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
  async generateTip(@Body() generateTipDto: GenerateTipDto) {
    const { prompt, lang } = generateTipDto;
    return this.tipsService.generateTip(prompt, lang);
  }

  @Get()
  async getAllTips() {
    return this.tipsService.getAllTips();
  }
}
