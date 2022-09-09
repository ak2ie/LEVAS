import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { LineController } from './line.controller';
import { LineService } from './line.service';

describe('LineController', () => {
  let lineController: LineController;
  let lineService: LineService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      controllers: [LineController],
      providers: [LineService],
    }).compile();

    lineService = moduleRef.get<LineService>(LineService);
    lineController = moduleRef.get<LineController>(LineController);
  });
  describe('findAll', () => {
    it('OK', async () => {
      const res = await lineService.sendBroadcastMessage('test');
      expect(res).toBe('OK');
    });
  });
});
