import { Client } from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import Setting from '../firestore/setting';
import { CreateLineDto } from './dto/create-line.dto';
import { CreateLineMessageDto } from './dto/create-lineMessage';
import { LineService } from './line.service';

jest.mock('fireorm', () => {
  return {
    Collection: () => jest.fn(),
    getRepository: () => ({
      create: (_) => {
        const setting = new Setting();
        setting.id = '1';
        return setting;
      },
      //   findById: (id: string) => {
      //     if (id === 'validId') {
      //       return new Promise((resolve, _) => {
      //         const ms = new MineSweeper();
      //         ms.panels = [new Panel('dummy1', false), new Panel('dummy2', true)];
      //         ms.title = 'ダミータイトル';
      //         ms.message = 'ダミーメッセージ';
      //         resolve(ms);
      //       });
      //     } else if (id === 'invalidId') {
      //       return new Promise((resolve, _) => {
      //         resolve(undefined);
      //       });
      //     }
      //   },
    }),
  };
});

describe('登録', () => {
  let service: LineService;
  let spy;

  beforeEach(async () => {
    const client = new Client({
      channelAccessToken: 'dummy',
      channelSecret: 'dummy',
    });
    spy = jest.spyOn(client, 'broadcast');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineService,
        {
          provide: Client,
          useFactory: () => {
            return client;
          },
        },
      ],
    }).compile();

    service = await module.resolve<LineService>(LineService);
  });

  it('正常', async () => {
    const dto = new CreateLineMessageDto();
    expect(await service.sendBroadcastMessage(dto)).toBe('OK');
    expect(spy).toHaveBeenCalled();
    expect(spy).toBeCalledWith({
      type: 'text',
      text: 'dummy',
    });
  });
});
