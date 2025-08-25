import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AffirmationsModule } from './affirmations/affirmations.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { DiaryModule } from './diary/diary.module';
import { HuggingFaceService } from './huggingface/huggingface.service';
import { MoodRecordModule } from './mood-record/mood-record.module';
import { OpenaiService } from './openai/openai.service';
import { TagsModule } from './tags/tags.module';
import { TipsModule } from './tips/tips.module';
import { TranslationsService } from './translations/translations.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    AffirmationsModule,
    ArticlesModule,
    DiaryModule,
    TagsModule,
    TipsModule,
    MoodRecordModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    OpenaiService,
    HuggingFaceService,
    UsersService,
    TranslationsService,
  ],
})
export class AppModule {}
