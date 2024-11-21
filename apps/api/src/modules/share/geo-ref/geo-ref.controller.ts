import { FilterQuery } from '@mikro-orm/core';
import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GeoRefEntity } from '~/entities';
import { GeoRefResponseMapper } from '~/mappers/responses/GeoRefResponseMapper ';
import { GeoRefFilterDto, GeoRefResponseDto } from '~/share/dtos';
import { GeoRefService } from './geo-ref.service';

@ApiTags('GeoRef - Locations')
@Controller('georefs')
@ApiBearerAuth()
export class GeoRefController {
  constructor(private readonly geoRefService: GeoRefService) {}

  @Get()
  @ApiOperation({ summary: 'GeoRef list by condition' })
  @ApiResponse({ status: 200, type: [GeoRefResponseDto] })
  async getGeoRefs(
    @Query() query: GeoRefFilterDto,
  ): Promise<GeoRefResponseDto[]> {
    const condition: FilterQuery<GeoRefEntity> = {};

    if (query.zipCode) {
      condition.zipCode = { $like: `%${query.zipCode}%` };
    }

    if (query.steName) {
      condition.steName = { $like: `%${query.steName}%` };
    }
    const geoRefs = await this.geoRefService.findByCondition(condition);
    return new GeoRefResponseMapper().mapArray(geoRefs);
  }

  @Get(':geoRefId')
  @ApiOperation({ summary: 'Geo Reft detail' })
  @ApiResponse({ status: 200, type: GeoRefResponseDto })
  async getLocation(
    @Param('geoRefId') geoRefId: string,
  ): Promise<GeoRefResponseDto | null> {
    const geoRef = await this.geoRefService.findById(geoRefId);
    if (!geoRef) {
      return null;
    }
    return new GeoRefResponseMapper().map(geoRef);
  }
}
