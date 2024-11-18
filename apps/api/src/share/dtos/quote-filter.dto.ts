import { Enum } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { QuoteStatus } from '../consts/enums';

export class QuoteFilterDto {
  @ApiProperty({ required: false, example: 'WAITINGs' })
  @IsOptional()
  @Enum(() => QuoteStatus)
  status?: QuoteStatus;
}
