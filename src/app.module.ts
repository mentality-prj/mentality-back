import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesController } from './articles/articles.controller';
import { OpenaiService } from './openai/openai.service';
import { Tag, TagSchema } from './tags/schemas/tag.schema';
import { TagsModule } from './tags/tags.module';
import { User, UserSchema } from './users/schemas/user.schema';
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
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Tag.name, schema: TagSchema },
    ]),
    TagsModule,
  ],
  controllers: [AppController, ArticlesController],
  providers: [AppService, OpenaiService, UsersService],
})
export class AppModule {}
