import { ApiProperty } from '@nestjs/swagger';

export class GeoRefResponseDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: '1234' })
  zipCode!: string;

  @ApiProperty({ required: true, example: 'New Jersey' })
  steName!: string;
}
