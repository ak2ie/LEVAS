import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { logger } from './middlewares/logger.middleware';
import { FireormModule } from 'nestjs-fireorm';
import { UsersModule } from './users.module';
import { UserController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { LineModule } from './line/line.module';
import { SettingModule } from './setting/setting.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FireormModule.forRootAsync({
      useFactory: () => ({
        firestore: admin.firestore(),
        fireormSettings: { validateModels: true },
      }),
    }),
    UsersModule,
    LineModule,
    SettingModule,
    AuthModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes(AppController);
  }
}
