import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { LIMIT, PAGE } from 'src/constants';

import { GamesEntity } from './entities/games.entity';
import { GamesService } from './games.service';
import { Games } from './schemas/games.schema';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Game created', type: GamesEntity })
  async createGame(): Promise<Games> {
    return this.gamesService.createGame();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Game found', type: GamesEntity })
  async getGame(@Param('id') id: string): Promise<Games> {
    return this.gamesService.getGameById(id);
  }

  @Get('unpublished')
  @ApiResponse({
    status: 200,
    description: 'Unpublished games',
    type: [GamesEntity],
  })
  async getAllUnpublished(): Promise<Games[]> {
    return this.gamesService.getAllUnpublished();
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Game updated', type: GamesEntity })
  async updateGame(
    @Param('id') id: string,
    @Body('isPublished') isPublished: boolean,
  ): Promise<Games> {
    return this.gamesService.updateGame(id, isPublished);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of games',
    type: [GamesEntity],
  })
  async getManyWithPagination(
    @Query('page') page: number = PAGE,
    @Query('limit') limit: number = LIMIT,
  ): Promise<Games[]> {
    return this.gamesService.getAllGames(page, limit);
  }
}
