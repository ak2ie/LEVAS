import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Collection, getRepository } from 'fireorm';
import Setting from '../firestore/setting';
import { HTTPError } from '@line/bot-sdk';

@Injectable()
export class SettingService {
  /**
   * チャネル ID・シークレット登録
   * @param createSettingDto
   * @returns
   */
  async create(createSettingDto: CreateSettingDto) {
    if (
      createSettingDto.channelID.trim() === '' ||
      createSettingDto.channelSecret.trim() === ''
    ) {
      throw new Error('チャネルIDまたはチャネルシークレットが未設定です');
    }
    const settingRepository = getRepository(Setting);
    const setting = new Setting();
    setting.channelID = createSettingDto.channelID;
    setting.channelSecret = createSettingDto.channelSecret;
    await settingRepository.create(setting);
    return;
  }

  /**
   * チャネル ID・シークレット取得
   * @returns
   */
  async findAll(userId: string) {
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.userId, userId)
      .findOne();
    const settingDto = new CreateSettingDto();
    settingDto.channelID = record.channelID;
    settingDto.channelSecret = record.channelSecret;
    return settingDto;
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return `This action updates a #${id} setting`;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
