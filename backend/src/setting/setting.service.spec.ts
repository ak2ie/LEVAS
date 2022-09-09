import { Test, TestingModule } from '@nestjs/testing';
import Setting from '../firestore/setting';
import { CreateSettingDto } from './dto/create-setting.dto';
import { SettingService } from './setting.service';

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
  let service: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingService],
    }).compile();

    service = module.get<SettingService>(SettingService);
  });

  it('正常', async () => {
    const dto = new CreateSettingDto();
    dto.channelID = 'dummy_channelID';
    dto.channelSecret = 'dummy_channelSecret';
    expect(await service.create(dto)).toBe(undefined);
  });

  it('異常（チャネルIDが未設定）', async () => {
    const dto = new CreateSettingDto();
    dto.channelID = '';
    dto.channelSecret = 'dummy_channelSecret';
    await expect(service.create(dto)).rejects.toThrow();
  });

  it('異常（チャネルシークレットが未設定）', async () => {
    const dto = new CreateSettingDto();
    dto.channelID = 'dummy_channelID';
    dto.channelSecret = '';
    await expect(service.create(dto)).rejects.toThrow();
  });
});
