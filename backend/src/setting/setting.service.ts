import { HttpStatus, Injectable, Req } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Collection, getRepository } from 'fireorm';
import Setting from '../firestore/setting';
import { HTTPError } from '@line/bot-sdk';
import { UpdateFriendDto } from './dto/update-friend.dto';

@Injectable()
export class SettingService {
  /**
   * チャネル ID・シークレット登録
   * @param createSettingDto
   * @returns
   */
  async saveChannelIDAndSecret(
    firebaseUserId: string,
    createSettingDto: CreateSettingDto,
  ) {
    // TODO: アクセストークンを発行して保存

    const settingRepository = getRepository(Setting);
    const setting = new Setting();
    setting.channelID = createSettingDto.channelID;
    setting.channelSecret = createSettingDto.channelSecret;
    setting.userId = firebaseUserId;
    await settingRepository.create(setting);
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
      .whereEqualTo((Setting) => Setting.userId, firebaseUserId)
      .findOne();
    if (!record) {
      throw new Error('未登録のユーザー');
    }
    if (record.channelID !== '' && record.channelSecret !== '') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 友だちの情報を更新する
   * @param firebaseUserId 管理者Firebase ID
   * @param updateUserDto 友だち更新情報
   */
  async updateFriendInfo(
    firebaseUserId: string,
    updateFriendDto: UpdateFriendDto,
  ) {
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.userId, firebaseUserId)
      .findOne();
    if (!record) {
      throw new Error('未登録のユーザー');
    }
    record.users = record.users.map((user) => {
      if (user.userID === updateFriendDto.userID) {
        user.userName = updateFriendDto.userName;
      }
      return user;
    });
    record.events = record.events.map((event) => {
      event.answers.map((answer) => {
        if (answer.userID === updateFriendDto.userID) {
          answer.userName = updateFriendDto.userName;
        }
        return answer;
      });
      return event;
    });
    await settingRepository.update(record);
  }
}
