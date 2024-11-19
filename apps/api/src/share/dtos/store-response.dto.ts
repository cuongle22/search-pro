import { ApiProperty } from '@nestjs/swagger';
import { StoreStatus } from '~/share/consts/enums';
import { MinAttachmentDto } from './min.dto';

export class MinOwnerDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: 'STORE_OWNER' })
  userName!: string;

  @ApiProperty({ required: true, example: 'admin@mail.com' })
  email!: string;
}

export class MinLocationDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: 'HCM' })
  name!: string;

  @ApiProperty({ required: true, example: '123 Wall street' })
  address!: string;
}

export class StoreResponseDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: 'Store name' })
  name!: string;

  @ApiProperty({ example: 'Store description' })
  description?: string;

  @ApiProperty({ example: 'Primary phone' })
  primaryPhone?: string;

  @ApiProperty({ example: 'Secondary phone' })
  secondaryPhone?: string;

  @ApiProperty({ example: 'Secondary phone' })
  email?: string;

  @ApiProperty({ example: 'http://store.com' })
  website?: string;

  @ApiProperty({ required: true, example: 'ACTIVE' })
  status!: StoreStatus;

  @ApiProperty({ required: true, type: [MinOwnerDto] })
  owners!: MinOwnerDto[];

  @ApiProperty({ type: [MinLocationDto] })
  locations?: MinLocationDto[];

  @ApiProperty({ required: false, type: MinAttachmentDto })
  banner!: MinAttachmentDto;
}
