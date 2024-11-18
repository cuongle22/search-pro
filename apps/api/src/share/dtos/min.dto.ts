import { ApiProperty } from '@nestjs/swagger';

export class MinDto<T> {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true })
  value!: T;
}

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

  @ApiProperty({ required: true, example: '12345' })
  price!: number;
}

export class MinAttachmentDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: 'Store Name' })
  name!: string;

  @ApiProperty({ required: true, example: 'image/png' })
  type!: string;

  @ApiProperty({ required: true, example: 'https://example.com/image.png' })
  url!: string;
}
