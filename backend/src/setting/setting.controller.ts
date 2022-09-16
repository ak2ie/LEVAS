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
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { DecodedIdToken } from 'firebase-admin/auth';

@Controller('setting')
@UseGuards(FirebaseAuthGuard)
@ApiTags('設定')
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
  @Post('friend')
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
}
