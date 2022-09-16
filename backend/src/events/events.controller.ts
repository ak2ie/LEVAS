import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseEventDto } from './dto/read-event.dto';
import { ResponseEventListDto } from './dto/response-events.dto';

@UseGuards(FirebaseAuthGuard)
@Controller('events')
@ApiBearerAuth()
@ApiTags('イベント')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({
    description: 'イベントを作成し、LINEで通知する',
  })
  async create(@Body() createEventDto: CreateEventDto): Promise<boolean> {
    return true; //this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({
    description: 'イベント一覧を取得する',
  })
  @ApiResponse({
    type: ResponseEventListDto,
  })
  async findAll(@Request() req): Promise<ResponseEventListDto> {
    return new ResponseEventListDto(); // this.eventsService.findAll(req.user);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'イベントID',
  })
  @ApiOperation({
    description: '個別のイベントを取得する',
  })
  @ApiResponse({
    type: ResponseEventDto,
  })
  async findOne(@Param('id') id: string): Promise<ResponseEventDto> {
    return new ResponseEventDto(); //this.eventsService.findOne(+id);
  }
}
