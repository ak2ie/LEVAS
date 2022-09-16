import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';
export class CreateLineDto {
  /**
   * ボットのユーザーID
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  destination: string;
}
