import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: ['set-cookie'],
  });

  const config = new DocumentBuilder()
    .setTitle('expense-backend')
    .addBearerAuth()
    .setVersion('1.0')
    .addServer('http://localhost:8080', 'local server')
    .addServer('https://expense-backend.cyclic.app', 'cyclic server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, () => {
    console.log(`Application is running on: ${PORT} port`);
  });
}
bootstrap();
