import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class StoreOwnerCreationDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({ required: true, type: 'string', format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive!: boolean;
}
