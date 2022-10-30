import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Logger,
  Request,
  Req,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { FirebaseAuthGuard } from '../auth/firebase.guard';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
import { ReponseFriendDto, ReponseFriendItem } from './dto/response-friend.dto';
import { boolean } from 'joi';

@Controller('settings')
@UseGuards(FirebaseAuthGuard)
@ApiTags('設定')
@ApiBearerAuth()
@ApiHeader({
  name: 'Bearer',
  description: 'Firebase IDトークン',
})
export class SettingController {
  private readonly logger = new Logger('setting');

  constructor(private readonly settingService: SettingService) {}

  /**
   * LINE チャネルID・シークレットを保存する
   * @returns
   */
  @Post('token')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    description: 'LINE チャネルID・トークンを保存する',
  })
  @ApiResponse({
    status: 201,
    description: '正常登録',
  })
  @ApiResponse({
    status: 400,
    content: {
      'application/json': {
        examples: {
          bodyInvalid: {
            description: 'チャネルID・シークレットが不正',
            value: {
              result: false,
              reason: 'Channel ID, Secret is InValid',
            },
          },
        },
      },
    },
  })
  async saveToken(
    @Request() req: Request & { user: DecodedIdToken },
    @Body() dto: CreateSettingDto,
  ) {
    await this.settingService.saveChannelIDAndSecret(req.user.uid, dto);
  }

  /**
   * LINE チャネルID・シークレットを保存済みであるかを取得する
   * @returns
   */
  @Get('token')
  @ApiOperation({
    description: 'LINE チャネルID・トークンを保存済みであるかを返す',
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        examples: {
          saved: {
            description: '保存済',
            value: { result: true },
          },
          notSaved: {
            description: '未保存',
            value: { result: false },
          },
        },
      },
    },
  })
  async getToken(
    @Request() req: Request & { user: DecodedIdToken },
  ): Promise<{ result: boolean }> {
    this.settingService.getIsSavedChannelIDAndSecret(req.user.uid);
    return { result: true };
  }

  /**
   * 友だちの情報を更新する
   * @returns
   */
  @Post('friends')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    description: '友だち情報を更新する',
  })
  async updateFriend(
    @Request() req: Request & { user: DecodedIdToken },
    @Body() dto: UpdateFriendDto,
  ) {
    await this.settingService.updateFriendInfo(req.user.uid, dto);
  }

  @Get('friends')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    description: '友だち一覧を取得する',
  })
  @ApiExtraModels(ReponseFriendDto)
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(ReponseFriendDto),
        },
        examples: {
          noFriend: {
            value: { friends: [] },
            description: '友だちなし',
          },
          friends: {
            description: '友だちあり',
            value: {
              friends: [
                {
                  userID: 'userID1',
                  userName: 'ユーザー名1',
                  memo: 'メモ1',
                  imgUrl: 'https://example.com/img.jpg',
                  lineUserName: 'LINEユーザー名1',
                },
                {
                  userID: 'userID2',
                  userName: 'ユーザー名2',
                  memo: 'メモ2',
                  imgUrl: '',
                  lineUserName: 'LINEユーザー名2',
                },
              ],
            },
          },
        },
      },
    },
  })
  async getFriends(@Request() req: Request & { user: DecodedIdToken }) {
    return await this.settingService.getFriends(req.user.uid);
  }
}
