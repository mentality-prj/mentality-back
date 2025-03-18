import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MockOpenAIGameRulesService } from './__mock__/mock-openai.service';
import { Games } from './schemas/games.schema';

const DEFAULT_LIMIT = 10;

@Injectable()
export class GamesService {
  private openAIService: MockOpenAIGameRulesService;

  constructor(@InjectModel(Games.name) private GamesModel: Model<Games>) {
    this.openAIService = new MockOpenAIGameRulesService();
  }

  async generateGame(): Promise<string> {
    return this.openAIService.generateGameRule();
  }

  async generateAndSaveGame(): Promise<Games> {
    const textGames = await this.generateGame;

    const newGame = await this.GamesModel.create({
      textGames,
      isPublished: false,
    });

    return newGame;
  }

  async getAllAffirmations(
    page: number = 1,
    limit: number = DEFAULT_LIMIT,
  ): Promise<Games[]> {
    const skip = (page - 1) * limit;

    return this.GamesModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async updateGames(id: string, isPublished: boolean): Promise<Games> {
    const updatedGames = await this.GamesModel.findByIdAndUpdate(
      id,
      { isPublished },
      { new: true },
    ).exec();

    if (!updatedGames) {
      throw new Error('Game not found');
    }

    return updatedGames;
  }
}
