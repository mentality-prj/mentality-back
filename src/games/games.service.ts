import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LIMIT, PAGE } from 'src/constants';

import { MockOpenAIGameRulesService } from './__mock__/mock-openai.service';
import { Games } from './schemas/games.schema';

@Injectable()
export class GamesService {
  private openAIService: MockOpenAIGameRulesService;

  // Inject the Games model
  constructor(@InjectModel(Games.name) private gamesModel: Model<Games>) {
    this.openAIService = new MockOpenAIGameRulesService();
  }

  // Generate a game
  async generateGame(): Promise<string> {
    const mockGR = this.openAIService.getMockGames();
    const randomIndex = Math.floor(Math.random() * mockGR.length);
    return mockGR[randomIndex];
  }

  // Create a game
  async createGame(): Promise<Games> {
    const textGames = await this.generateGame();
    // Create a new game
    const newGame = new this.gamesModel({
      textGames,
      isPublished: false,
      createdAt: new Date(),
    });

    return newGame.save();
  }

  // Get a game by ID
  async getGameById(id: string): Promise<Games> {
    const game = await this.gamesModel.findById(id).exec();
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  // Get all games with pagination
  async getAllGames(
    page: number = PAGE,
    limit: number = LIMIT,
  ): Promise<Games[]> {
    const skip = (page - 1) * limit;
    // Get all games while skipping and limiting the results
    return this.gamesModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // Update a game
  async updateGame(id: string, isPublished: boolean): Promise<Games> {
    // Update the game's published status
    const updatedGame = await this.gamesModel
      .findByIdAndUpdate(id, { isPublished }, { new: true })
      .exec();

    if (!updatedGame) {
      throw new NotFoundException('Game not found');
    }

    return updatedGame;
  }
  // Get all unpublished games
  async getAllUnpublished(): Promise<Games[]> {
    return this.gamesModel.find({ isPublished: false }).exec();
  }
}
