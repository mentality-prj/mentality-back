import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { LIMIT, PAGE } from 'src/constants';

import { GamesService } from './games.service';
import { Games } from './schemas/games.schema';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  async createGame(): Promise<Games> {
    return this.gamesService.createGame();
  }

  @Get(':id')
  async getGame(@Param('id') id: string): Promise<Games> {
    return this.gamesService.getGameById(id);
  }

  @Get('unpublished')
  async getAllUnpublished(): Promise<Games[]> {
    return this.gamesService.getAllUnpublished();
  }

  @Put(':id')
  async updateGame(
    @Param('id') id: string,
    @Body('isPublished') isPublished: boolean,
  ): Promise<Games> {
    return this.gamesService.updateGame(id, isPublished);
  }

  @Get()
  async getManyWithPagination(
    @Query('page') page: number = PAGE,
    @Query('limit') limit: number = LIMIT,
  ): Promise<Games[]> {
    return this.gamesService.getAllGames(page, limit);
  }
}
