import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '~/decorators';
import { StoreCreationEntityMapper } from '~/mappers/entities/StoreCreationEntityMapper';
import { StoreResponseMapper } from '~/mappers/responses/StoreResponseMapper';
import { StoreCreationDto, StoreUpdatingDto } from '~/shares/dtos';
import { StoreResponseDto } from '~/shares/dtos/store-response.dto';
import { UserResponseDto } from '~/shares/dtos/user-response.dto';
import { JwtGuard } from '../auth/guard';
import { StoresService } from './stores.service';
import { RolesGuard } from '~/decorators/role-guard.decorator';

@ApiTags('stores')
@Controller('stores')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @ApiOperation({ summary: 'List all stores' })
  @ApiResponse({ status: 200, type: [StoreResponseDto] })
  async findAll(
    @CurrentUser() user: UserResponseDto,
  ): Promise<StoreResponseDto[]> {
    const stores = await this.storesService.findByCondition({
      owners: [user.id],
    });
    return new StoreResponseMapper().mapArray(stores);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({ status: 201, type: StoreResponseDto })
  async create(
    @CurrentUser() user: UserResponseDto,
    @Body() storeCreationDto: StoreCreationDto,
  ): Promise<StoreResponseDto> {
    const creationData = new StoreCreationEntityMapper().map(storeCreationDto, {
      owner: user.id,
    });
    const store = await this.storesService.create(creationData);
    return new StoreResponseMapper().map(store);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a store' })
  @ApiResponse({ status: 200, type: StoreResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateStoreDto: StoreUpdatingDto,
  ): Promise<StoreResponseDto> {
    const store = await this.storesService.update(id, updateStoreDto);
    return new StoreResponseMapper().map(store);
  }

  @Delete(':id')
  @RolesGuard('ADMIN')
  @ApiOperation({ summary: 'Inactive a store' })
  @ApiResponse({ status: 200 })
  async softDelete(@Param('id') id: string): Promise<void> {
    return this.storesService.softDelete(id);
  }
}
