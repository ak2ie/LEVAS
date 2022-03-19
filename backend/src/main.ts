import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { initializeFirebase } from './firebase';

async function bootstrap() {
  initializeFirebase();

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());

  /* ------------------------------------------------------------
   * Swagger
   * ------------------------------------------------------------*/
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
