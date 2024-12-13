import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Put
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '~/decorators';
import { RolesGuard } from '~/decorators/role-guard.decorator';
import { LocationCreationEntityMapper } from '~/mappers/entities/LocationCreationEntityMapper';
import { StoreLocationResponseMapper } from '~/mappers/responses/StoreLocationResponseMapper';
import { JwtGuard } from '~/modules/share/auth/guard';
import { StoreLocationResponseDto } from '~/share/dtos';
import { LocationCreationDto } from '~/share/dtos/store-location-creation.dto';
import { UserResponseDto } from '~/share/dtos/user-response.dto';
import { AdminLocationService } from './admin-location.service';
import { LocationStatus } from '~/share/consts/enums';
import { GeoRefService } from '~/modules/share/geo-ref/geo-ref.service';

@ApiTags('System - Locations')
@Controller('admin/stores/:storeId/locations')
@RolesGuard('SUPER_ADMIN')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class AdminLocationController {
  constructor(private readonly adminLocationService: AdminLocationService,
    private readonly geoService: GeoRefService
  ) { }

  @Get()
  @ApiOperation({ summary: 'Location list' })
  @ApiResponse({ status: 200, type: [StoreLocationResponseDto] })
  async getLocations(
    @Param('storeId') storeId: string,
  ): Promise<StoreLocationResponseDto[]> {
    const locations = await this.adminLocationService.findByCondition({
      store: storeId,
    });
    return new StoreLocationResponseMapper().mapArray(locations);
  }

  @Get(':locationId')
  @ApiOperation({ summary: 'Get location detail' })
  @ApiResponse({ status: 200, type: StoreLocationResponseDto })
  async getLocation(
    @CurrentUser() _: UserResponseDto,
    @Param('locationId') locationId: string,
  ): Promise<StoreLocationResponseDto | null> {
    const location = await this.adminLocationService.findById(locationId);
    if (!location) {
      return null;
    }
    return new StoreLocationResponseMapper().map(location);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, type: StoreLocationResponseDto })
  async create(
    @Param('storeId') storeId: string,
    @CurrentUser() user: UserResponseDto,
    @Body() locationCreationDto: LocationCreationDto,
  ): Promise<StoreLocationResponseDto> {
    const creationData = new LocationCreationEntityMapper().map(
      locationCreationDto,
      { storeId, createdBy: user.id },
    );
    const location = await this.adminLocationService.create({
      ...creationData,
      createdBy: user.id,
    });
    return new StoreLocationResponseMapper().map(location);
  }


  @Put(':locationId')
  @ApiOperation({ summary: 'Update a Location' })
  @ApiResponse({ status: 200, type: StoreLocationResponseDto })
  async updateStore(
    @CurrentUser() user: UserResponseDto,
    @Param('locationId') locationId: string,
    @Body() locationCreationDto: LocationCreationDto,
  ): Promise<StoreLocationResponseDto | null> {

    const _location = await this.adminLocationService.findById(locationId);
    if (!_location) {
      return null;
    }

    const status = locationCreationDto.isActive ? LocationStatus.ACTIVE : LocationStatus.INACTIVE;
    const geoRefId = locationCreationDto.geoRefId ?? _location.geoRef.id;
    const geo = await this.geoService.findById(geoRefId);
    if (!geo) {
      return null;
    }

    const location = await this.adminLocationService.update(locationId, {
      name: locationCreationDto.name ?? _location.name,
      address: locationCreationDto.address ?? _location.address,
      openTime: locationCreationDto.openTime ?? _location.openTime,
      closeTime: locationCreationDto.closeTime ?? _location.closeTime,
      geoRef: geo,
      status: status,
      updatedBy: user.id,
    });

    return new StoreLocationResponseMapper().map(location);


  }

  @Delete(':locationId')
  @ApiOperation({ summary: 'Inactive a location' })
  @ApiResponse({ status: 200 })
  async deleteLocation(@Param('id') id: string): Promise<void> {
    return this.adminLocationService.softDelete(id);
  }
}
