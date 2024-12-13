import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';

import { SupportedLanguage } from 'src/constants/supported-languages.constant';
import { OpenaiService } from 'src/openai/openai.service';

import { TipEntity } from './entities/tip.entity';
import { TipsMapper } from './helpers/tips.mapper';
import { Tip } from './schemas/tip.schema';

@Injectable()
export class TipsService {
  constructor(
    @InjectModel('Tip') private tipModel: Model<Tip>,
    private readonly openaiService: OpenaiService,
  ) {}

  async generateTip(
    prompt?: string,
    lang?: SupportedLanguage,
  ): Promise<TipEntity> {
    const content = await this.openaiService.generateTip(prompt, lang);
    const tip = new this.tipModel({ content });
    await tip.save();
    return TipsMapper.toTipEntity(tip);
  }

  async getAllTips() {
    return this.tipModel.find().sort({ createdAt: -1 }).exec();
  }

  async updateTip(
    id: string,
    translations: Record<SupportedLanguage, string>,
    isPublished: boolean,
  ): Promise<TipEntity> {
    const updatedTip = await this.tipModel
      .findByIdAndUpdate(
        id,
        { translations, updatedAt: new Date(), isPublished },
        { new: true },
      )
      .exec();
    if (!updatedTip) {
      throw new NotFoundException('Tag not found');
    }
    return TipsMapper.toTipEntity(updatedTip);
  }

  @Cron('0 9,21 * * *')
  async generateDailyTips() {
    await this.generateTip();
  }
}
