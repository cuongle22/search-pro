import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserCreationDto {
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

  @ApiProperty({ required: false, type: 'string' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
