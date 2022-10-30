import { HttpStatus, Inject, Injectable, Req } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Collection, createBatch, getRepository } from 'fireorm';
import Setting from '../firestore/setting';
import { Client, HTTPError } from '@line/bot-sdk';
import { UpdateFriendDto } from './dto/update-friend.dto';
import Answer from 'src/firestore/answer';
import { ReponseFriendDto } from './dto/response-friend.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { URLSearchParams } from 'url';

@Injectable()
export class SettingService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * チャネル ID・シークレット登録
   * @param createSettingDto
   * @returns
   */
  async saveChannelIDAndSecret(
    userFirebaseId: string,
    createSettingDto: CreateSettingDto,
  ) {
    /* --------------------------------------------------------------------------
     * アクセストークン取得
     * -------------------------------------------------------------------------- */
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: createSettingDto.channelID,
      client_secret: createSettingDto.channelSecret,
    });

    const result = await lastValueFrom(
      this.httpService
        .post('https://api.line.me/v2/oauth/accessToken', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .pipe(
          catchError((e) => {
            throw new Error('');
          }),
        )
        .pipe(map((response) => response.data)),
    );

    /* --------------------------------------------------------------------------
     * DB保存
     * -------------------------------------------------------------------------- */
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.userFirebaseId, userFirebaseId)
      .findOne();
    if (record) {
      record.channelID = createSettingDto.channelID;
      record.channelSecret = createSettingDto.channelSecret;
      record.accessToken = result.access_token;
      await settingRepository.update(record);
    } else {
      const setting = new Setting();
      setting.channelID = createSettingDto.channelID;
      setting.channelSecret = createSettingDto.channelSecret;
      setting.userFirebaseId = userFirebaseId;
      setting.accessToken = result.access_token;
      setting.createdAt = new Date();
      await settingRepository.create(setting);
    }
    return;
  }

  /**
   * LINEチャネルID、シークレットを登録済みであるかを返す
   * @param firebaseUserId FirebaseユーザーID
   * @returns 登録済みならtrue
   */
  async getIsSavedChannelIDAndSecret(firebaseUserId: string): Promise<boolean> {
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.userFirebaseId, firebaseUserId)
      .findOne();
    if (record && record.channelID !== '' && record.channelSecret !== '') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 友だちの情報を更新する
   * @param userFirebaseId 管理者Firebase ID
   * @param updateUserDto 友だち更新情報
   */
  async updateFriendInfo(
    userFirebaseId: string,
    updateFriendDto: UpdateFriendDto,
  ): Promise<void> {
    /* --------------------------------------------------------------------------
     * DBデータ取得
     * -------------------------------------------------------------------------- */
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.userFirebaseId, userFirebaseId)
      .findOne();
    if (!record) {
      throw new Error('未登録のユーザー');
    }

    const user = await record.users.findById(updateFriendDto.userID);
    if (!user) {
      throw new Error('未登録の友だち');
    }

    const events = await record.events.find();
    /* --------------------------------------------------------------------------
     * DB更新
     * -------------------------------------------------------------------------- */
    // 友だち一覧
    user.userName = updateFriendDto.userName;
    user.memo = updateFriendDto.memo;
    await record.users.update(user);

    // 参加可否
    const batch = createBatch();
    const answersBatch = batch.getRepository(Answer);

    let isRequireCommit = false;
    for (const event of events) {
      const answers = await event.answers
        .whereEqualTo((Answer) => Answer.userFirebaseId, updateFriendDto.userID)
        .find();
      for (const answer of answers) {
        answer.userName = updateFriendDto.userName;
        answersBatch.update(answer);
        isRequireCommit = true;
      }
    }

    if (isRequireCommit) {
      await batch.commit();
    }
  }

  /**
   * 友だち一覧を取得する
   * @param userFirebaseId 管理者FirebaseID
   * @returns 友だち一覧
   */
  async getFriends(userFirebaseId: string): Promise<ReponseFriendDto> {
    /* --------------------------------------------------------------------------
     * DBデータ取得
     * -------------------------------------------------------------------------- */
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.userFirebaseId, userFirebaseId)
      .findOne();
    if (!record) {
      throw new Error('未登録のユーザー');
    }

    const users = await record.users.find();

    /* --------------------------------------------------------------------------
     * データ整形
     * -------------------------------------------------------------------------- */
    const dto = new ReponseFriendDto();
    dto.friends = users.map((user) => ({
      userID: user.id,
      userName: user.userName,
      lineUserName: user.lineUserName,
      imgUrl: user.imgUrl,
      memo: user.memo,
    }));

    return dto;
  }
}
