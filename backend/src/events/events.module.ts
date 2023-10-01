import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { LineModule } from 'src/line/line.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [LineModule],
})
export class EventsModule {}
