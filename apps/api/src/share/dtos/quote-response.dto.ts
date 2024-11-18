import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { QuoteStatus } from '../consts/enums';

class MinProductDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: 'SKU123' })
  sku!: string;

  @ApiProperty({ required: false, example: 'Product Name' })
  name?: string;
}

class MinStoreDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: 'Store Name' })
  name!: string;

  @ApiProperty({ required: true, example: '12345' })
  phone!: string;
}

class MinLocationDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: 'Location Name' })
  name!: string;

  @ApiProperty({ required: true, example: '12345' })
  price!: number;

  @ApiProperty({ required: true, example: '12345' })
  address!: string;

  @ApiProperty({ required: true, example: 'New Jersey' })
  openTime!: string;

  @ApiProperty({ required: true, example: 'New Jersey' })
  closeTime!: string;
}

export class QuoteResponseDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  @IsString()
  id!: string;

  @ApiProperty({ required: true, type: MinProductDto })
  product!: MinProductDto;

  @ApiProperty({ required: true, type: MinStoreDto })
  store!: MinStoreDto;

  @ApiProperty({ required: true, type: MinLocationDto })
  location!: MinLocationDto;

  @ApiProperty({ required: false, example: 'WAITING' })
  status?: QuoteStatus = QuoteStatus.WAITING;
}
