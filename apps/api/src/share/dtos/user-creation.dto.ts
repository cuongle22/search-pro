import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UserCreationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

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
  @Min(4)
  password!: string;
}
