import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { EventDetail, ResponseEventDto } from './dto/read-event.dto';
import { ResponseEventListDto } from './dto/response-events.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase.guard';
import { DecodedIdToken } from 'firebase-admin/auth';

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
  @ApiResponse({
    status: 201,
    description: '正常',
  })
  @ApiResponse({
    status: 429,
    description: 'LINEサーバー側要因によるエラー（月間送信可能件数超過など）',
  })
  async create(@Body() createEventDto: CreateEventDto): Promise<boolean> {
    return true; //this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({
    description: 'イベント一覧を取得する',
  })
  @ApiExtraModels(ResponseEventListDto)
  @ApiResponse({
    status: 200,
    links: {},
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(ResponseEventListDto),
        },
        examples: {
          empty: {
            description: '空',
            value: { events: [] },
          },
          multi: {
            description: '複数',
            value: {
              events: [
                {
                  eventID: 'eventId1',
                  eventName: 'イベント名1',
                  createdAt: new Date(2022, 5, 10),
                },
                {
                  eventID: 'eventId2',
                  eventName: 'イベント名2',
                  createdAt: new Date(2022, 5, 14),
                },
              ],
            },
          },
        },
      },
    },
  })
  async findAll(
    @Request() req: Request & { user: DecodedIdToken },
  ): Promise<ResponseEventListDto> {
    return await this.eventsService.findAll(req.user.uid);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'イベントID',
  })
  @ApiOperation({
    description: '個別のイベントを取得する',
  })
  @ApiExtraModels(ResponseEventDto)
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(ResponseEventDto),
        },
        examples: {
          answer: {
            description: '回答あり',
            value: {
              event: {
                eventID: 'eventId1',
                eventName: 'イベント名1',
                createdAt: '2022-09-17T00:03:22.601Z',
                message: 'イベントに参加しますか？',
                leftButtonLabel: '参加する',
                rightButtonLabel: '参加しない',
                answers: [
                  {
                    userName: 'ユーザーA',
                    Attendance: '参加する',
                    date: '2022-09-17T00:04:51.601Z',
                  },
                  {
                    userName: 'ユーザーB',
                    Attendance: '参加しない',
                    date: '2022-09-15T00:07:33.601Z',
                  },
                ],
              },
            },
          },
          noAnswer: {
            description: '回答なし',
            value: {
              event: {
                eventID: 'eventId1',
                eventName: 'イベント名1',
                createdAt: '2022-09-17T00:03:22.601Z',
                message: 'イベントに参加しますか？',
                leftButtonLabel: '参加する',
                rightButtonLabel: '参加しない',
                answers: [],
              },
            },
          },
        },
      },
    },
  })
  async findOne(
    @Request() req: Request & { user: DecodedIdToken },
    @Param('id') id: string,
  ): Promise<ResponseEventDto> {
    return await this.eventsService.findOne(req.user.uid, id);
  }
}
