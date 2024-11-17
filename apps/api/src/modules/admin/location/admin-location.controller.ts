import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '~/decorators';
import { RolesGuard } from '~/decorators/role-guard.decorator';
import { StoreLocationResponseMapper } from '~/mappers/responses/StoreLocationResponseMapper';
import { JwtGuard } from '~/modules/share/auth/guard';
import { StoreLocationResponseDto } from '~/share/dtos';
import { UserResponseDto } from '~/share/dtos/user-response.dto';
import AdminUserService from '../user/admin-user.service';
import { AdminLocationService } from './admin-location.service';

@ApiTags('System - Locations')
@Controller('admin/stores/:storeId/locations')
@RolesGuard('SUPER_ADMIN')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class AdminLocationController {
  constructor(
    private readonly adminLocationService: AdminLocationService,
    private readonly adminUserService: AdminUserService,
  ) {}

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
    @Param('storeId') storeId: string,
  ): Promise<StoreLocationResponseDto | null> {
    const location = await this.adminLocationService.findById(storeId);
    if (!location) {
      return null;
    }
    return new StoreLocationResponseMapper().map(location);
  }

  // @Post()
  // @ApiOperation({ summary: 'Create a new location' })
  // @ApiResponse({ status: 201, type: StoreLocationResponseDto })
  // async createStore(
  //   @CurrentUser() user: UserResponseDto,
  //   @Body() storeCreationDto: StoreLocationCreationDto,
  // ): Promise<StoreLocationResponseDto> {
  //   const creationData = new StoreCreationEntityMapper().map(storeCreationDto);
  //   const store = await this.adminLocationService.create({
  //     ...creationData,
  //     createdBy: user.id,
  //   });
  //   return new StoreLocationResponseMapper().map(store);
  // }

  // @Put(':id')
  // @ApiOperation({ summary: 'Update a store' })
  // @ApiResponse({ status: 200, type: StoreResponseDto })
  // async updateStore(
  //   @CurrentUser() user: UserResponseDto,
  //   @Param('id') id: string,
  //   @Body() updateStoreDto: StoreUpdatingDto,
  // ): Promise<StoreResponseDto> {
  //   const store = await this.adminLocationService.update(id, {
  //     ...updateStoreDto,
  //     updatedBy: user.id,
  //   });
  //   return new StoreResponseMapper().map(store);
  // }

  @Delete(':locationId')
  @ApiOperation({ summary: 'Inactive a location' })
  @ApiResponse({ status: 200 })
  async deleteLocation(@Param('id') id: string): Promise<void> {
    return this.adminLocationService.softDelete(id);
  }
}
