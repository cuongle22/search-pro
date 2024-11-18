import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class QuoteCreationDto {
  @ApiProperty({ required: true, example: '123456' })
  @IsString()
  productLocationId!: string;

  @ApiProperty({ required: true, example: 1 })
  @IsString()
  name!: string;

  @ApiProperty({ required: true, example: 1 })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({ required: true, example: 1 })
  @IsString()
  phone!: string;

  @ApiProperty({ required: true, example: 1 })
  @IsString()
  note!: string;
}
