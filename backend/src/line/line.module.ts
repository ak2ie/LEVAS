import { Client } from '@line/bot-sdk';
import { Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { getRepository } from 'fireorm';
import Setting from 'src/firestore/setting';
import { CreateLineDto } from './dto/create-line.dto';
import { LineController } from './line.controller';
import { LineService } from './line.service';

/* ------------------------------------------------------------
 * LINE
 * ------------------------------------------------------------*/
@Module({
  controllers: [LineController],
  providers: [
    {
      provide: 'LINE',
      scope: Scope.REQUEST,
      useFactory: async (req: Request) => {
        const json = req.body;
        const dto = new CreateLineDto();
        dto.destination = json.destination as string;
        const settingRepository = getRepository(Setting);
        const record = await settingRepository
          .whereEqualTo((Setting) => Setting.channelID, dto.destination)
          .findOne();
        if (!record) {
          throw new Error();
        }
        const client = new Client({
          channelAccessToken: record.accessToken,
          channelSecret: record.channelSecret,
        });
        return new LineService(client);
      },
      inject: [REQUEST],
    },
  ],
})
export class LineModule {}
