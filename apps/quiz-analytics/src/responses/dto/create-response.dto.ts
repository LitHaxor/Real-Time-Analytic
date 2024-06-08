import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateResponseDto {
  @IsString()
  @ApiProperty()
  questionId: string;

  @IsString()
  @ApiProperty()
  response: string;
}
