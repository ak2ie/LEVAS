import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { CreateLineMessageDto } from './dto/create-lineMessage';
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
  xdescribe('findAll', () => {
    it('OK', async () => {
      const dto = new CreateLineMessageDto();
      const res = await lineService.sendBroadcastMessage(dto);
      expect(res).toBe('OK');
    });
  });
});
