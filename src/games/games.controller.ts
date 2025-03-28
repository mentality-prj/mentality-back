import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { LIMIT, PAGE } from 'src/constants';

import { GamesEntity } from './entities/games.entity';
import { GamesService } from './games.service';
import { Games } from './schemas/games.schema';

@ApiTags('Games')
@Controller('games')
// Controller for managing games.
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  //    * Creates a new game and saves it to the database.
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Game created',
    type: GamesEntity,
  })
  async createGame(): Promise<Games> {
    return this.gamesService.createGame();
  }

  //    * Retrieves a game by its ID.
  //    * Throws an error if the game is not found.
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Game found',
    type: GamesEntity,
  })
  async getGame(@Param('id') id: string): Promise<Games> {
    return this.gamesService.getGameById(id);
  }

  //    * Retrieves all games with pagination.
  @Get('unpublished')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unpublished games',
    type: [GamesEntity],
  })
  //    * Retrieves all unpublished games.
  async getAllUnpublished(): Promise<Games[]> {
    return this.gamesService.getAllUnpublished();
  }

  //    * Updates a game's published status.
  @Put(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Game updated',
    type: GamesEntity,
  })
  async updateGame(
    @Param('id') id: string,
    @Body('isPublished') isPublished: boolean,
  ): Promise<Games> {
    // Update the game's published status.
    return this.gamesService.updateGame(id, isPublished);
  }

  //    * Retrieves all games with pagination.
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of games',
    type: [GamesEntity],
  })
  // retrieves all games with pagination.
  async getManyWithPagination(
    @Query('page') page: number = PAGE,
    @Query('limit') limit: number = LIMIT,
  ): Promise<Games[]> {
    // return the games with pagination.
    return this.gamesService.getAllGames(page, limit);
  }
}
