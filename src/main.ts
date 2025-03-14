import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { DEFAULT_PORT } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription(
      'Description of the documentation for the Mentality project',
    )
    .setVersion('1.0')
    .addTag('AI API')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Swagger documentation on the root route
  SwaggerModule.setup('', app, document);

  app.enableCors();

  await app.listen(process.env.PORT ?? DEFAULT_PORT, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
