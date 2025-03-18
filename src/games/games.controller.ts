import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

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

  @Put(':id')
  async updateGame(
    @Param('id') id: string,
    @Body('isPublished') isPublished: boolean,
  ): Promise<Games> {
    return this.gamesService.updateGame(id, isPublished);
  }

  @Delete(':id')
  async deleteGame(@Param('id') id: string): Promise<{ message: string }> {
    await this.gamesService.deleteGame(id);
    return { message: 'Game deleted successfully' };
  }
}
