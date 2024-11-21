import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  limit?: number;
}

export class PaginationResponseData<T> {
  @ApiPropertyOptional({ type: [Object], description: 'Data items' })
  data!: T[];

  @ApiPropertyOptional({ type: Number, description: 'Total number of items' })
  limit?: number;

  @ApiPropertyOptional({ type: Number, description: 'Current page number' })
  page?: number;
}
