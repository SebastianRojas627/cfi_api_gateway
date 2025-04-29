import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './logging/logger.middleware';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Main');
  const loggerMiddleware = new LoggerMiddleware

  const app = await NestFactory.create(AppModule);
  app.use(loggerMiddleware.use);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for my project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 5000);

  logger.log(`Server is running on port ${process.env.PORT}`);
}
bootstrap();
