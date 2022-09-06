import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { initializeFirebase } from './firebase';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  initializeFirebase();

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  const rawBodyBuffer = (req, res, buf, encoding) => {
    if (buf && buf.length) {
      // ここうまく型を解決する方法がわからなかった
      (req as any).rawBody = buf.toString(
        (encoding || 'utf8') as BufferEncoding,
      );
    }
  };

  app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
  app.use(bodyParser.json({ verify: rawBodyBuffer }));

  app.enableCors();
  app.use(helmet());

  /* ------------------------------------------------------------
   * Swagger
   * ------------------------------------------------------------*/
  const config = new DocumentBuilder()
    .setTitle('LEVAS API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
