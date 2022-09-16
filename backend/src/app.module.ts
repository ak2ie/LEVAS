import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FireormModule } from 'nestjs-fireorm';
import { ConfigModule } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { LineModule } from './line/line.module';
import { SettingModule } from './setting/setting.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FireormModule.forRootAsync({
      useFactory: () => ({
        firestore: admin.firestore(),
        fireormSettings: { validateModels: true },
      }),
    }),
    LineModule,
    SettingModule,
    AuthModule,
    EventsModule,
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options:
            process.env.NODE_ENV === 'development'
              ? {
                  singleLine: true,
                  colorize: true,
                  levelFirst: true,
                }
              : {},
        },
        serializers: {
          req: (req) => {
            req.body = req.raw.body;
            return req;
          },
          res: (res) => {
            res.body = res.payload;
            return res;
          },
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  //   configure(consumer: MiddlewareConsumer) {
  //     consumer.apply(logger).forRoutes(AppController);
  //   }
}
