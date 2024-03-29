import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSettingDto {
  /**
   * LINE チャネルID
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'LINE チャネルID',
  })
  channelID: string;
  /**
   * LINE チャネルシークレット
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'LINE チャネルシークレット',
  })
  channelSecret: string;
}
