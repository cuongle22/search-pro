import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GeoRefFilterDto {
  @ApiProperty({ required: false, example: '12345' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ required: false, example: 'New Jersey' })
  @IsOptional()
  @IsString()
  steName?: string;
}
