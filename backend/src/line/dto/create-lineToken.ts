import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';
export class CreateLineTokenDto {
  /**
   * LINE チャネルID
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'チャネルID',
  })
  channelID: string;

  /**
   * LINE チャネルシークレット
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  channelSecret: string;
}
