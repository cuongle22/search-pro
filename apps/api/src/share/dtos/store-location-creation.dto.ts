import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LocationCreationDto {
  @ApiProperty({ example: 'Location Name' })
  @IsString()
  name!: string;

  @ApiProperty({ example: '123 Hong Bang street' })
  @IsString()
  address!: string;

  @ApiProperty({ example: '10:30AM' })
  @IsString()
  openTime!: string;

  @ApiProperty({ example: '10:30PM' })
  @IsString()
  closeTime!: string;

  @ApiProperty({ example: '9da8b809-efdf-43ff-8ff5-03b364021fb6' })
  @IsString()
  geoRefId!: string;
}
