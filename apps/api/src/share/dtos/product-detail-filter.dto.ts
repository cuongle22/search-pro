import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProductDetailFilterDto {
  @ApiProperty({ required: true, example: '60540' })
  @IsString()
  zipCode!: string;

  @ApiProperty({ required: true, example: 'Illinois' })
  @IsString()
  steName!: string;
}
