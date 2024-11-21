import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class StoreCreationDto {
  @ApiProperty({ example: 'Store Name' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Store Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '123-456-7890', required: false })
  @IsOptional()
  @IsString()
  primaryPhone?: string;

  @ApiProperty({ example: '123-456-7890', required: false })
  @IsOptional()
  @IsString()
  secondaryPhone?: string;

  @ApiProperty({ example: 'store@example.com', required: true })
  @IsString()
  email!: string;

  @ApiProperty({ example: 'https://store.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;
}
