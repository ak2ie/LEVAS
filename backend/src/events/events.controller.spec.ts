import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from 'src/auth/auth.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let controller: EventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService, AuthModule],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  xit('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
