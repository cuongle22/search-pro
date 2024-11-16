import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '~/shares/consts/enums';
import { MinDto } from '~/shares/dtos/min.dto';

export class MinRoleDto extends MinDto<UserRole> {}

export class MinStoreDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: 'STORE_OWNER' })
  name!: string;
}

export class UserResponseDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: 'john' })
  userName!: string;

  @ApiProperty({
    required: true,
    type: 'string',
    format: 'email',
    example: 'john@example.com',
  })
  email!: string;

  @ApiProperty({ example: 'John' })
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  lastName?: string;

  @ApiProperty({ required: true, type: MinRoleDto })
  role!: MinDto<UserRole>;

  @ApiProperty({ required: true, type: [MinStoreDto] })
  stores!: MinDto<string>[];
}
