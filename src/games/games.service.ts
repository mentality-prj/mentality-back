import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MockOpenAIGameRulesService } from './__mock__/mock-openai.service';
import { Games } from './schemas/games.schema';

const DEFAULT_LIMIT = 10;

@Injectable()
export class GamesService {
  private openAIService: MockOpenAIGameRulesService;

  constructor(@InjectModel(Games.name) private gamesModel: Model<Games>) {
    this.openAIService = new MockOpenAIGameRulesService();
  }

  async generateGame(): Promise<string> {
    const mockGR = this.openAIService.getMockGames();
    const randomIndex = Math.floor(Math.random() * mockGR.length);
    return mockGR[randomIndex];
  }

  async createGame(): Promise<Games> {
    const textGames = await this.generateGame();

    const newGame = new this.gamesModel({
      textGames,
      isPublished: false,
      createdAt: new Date(),
    });

    return newGame.save();
  }

  async getGameById(id: string): Promise<Games> {
    const game = await this.gamesModel.findById(id).exec();
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  async getAllGames(
    page: number = 1,
    limit: number = DEFAULT_LIMIT,
  ): Promise<Games[]> {
    const skip = (page - 1) * limit;

    return this.gamesModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async updateGame(id: string, isPublished: boolean): Promise<Games> {
    const updatedGame = await this.gamesModel
      .findByIdAndUpdate(id, { isPublished }, { new: true })
      .exec();

    if (!updatedGame) {
      throw new NotFoundException('Game not found');
    }

    return updatedGame;
  }

  async deleteGame(id: string): Promise<{ message: string }> {
    const deletedGame = await this.gamesModel.findByIdAndDelete(id).exec();
    if (!deletedGame) {
      throw new NotFoundException('Game not found');
    }
    return { message: 'Game deleted successfully' };
  }
}
