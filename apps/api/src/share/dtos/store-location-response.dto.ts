import { ApiProperty } from '@nestjs/swagger';

export class MinStoreDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: 'Store Name' })
  name!: string;
}

export class MinGeoRefDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: '12345' })
  zipCode!: string;

  @ApiProperty({ required: true, example: 'New Jersey' })
  steName!: string;
}

export class StoreLocationResponseDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: '123 Hong Bang street' })
  address!: string;

  @ApiProperty({ example: '10:30AM' })
  openTime?: string;

  @ApiProperty({ example: '10:30PM' })
  closeTime?: string;

  @ApiProperty({ required: true, type: MinGeoRefDto })
  geoRef!: MinGeoRefDto;

  @ApiProperty({ required: true, type: MinStoreDto })
  store!: MinStoreDto;
}
