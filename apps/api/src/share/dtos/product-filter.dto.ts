import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class ProductFilterDto extends PaginationDto {
  @ApiProperty({ required: false, example: 'Ipad Air 4' })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiProperty({ required: true, example: '60540' })
  @IsString()
  zipCode!: string;

  @ApiProperty({ required: true, example: 'Illinois' })
  @IsString()
  steName!: string;
}
