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
import { StoreCreationDto, StoreUpdatingDto } from '~/share/dtos';
import { StoreResponseDto } from '~/share/dtos/store-response.dto';
import { UserResponseDto } from '~/share/dtos/user-response.dto';
import { JwtGuard } from '../share/auth/guard';
import { StoreService } from './store.service';
import { RolesGuard } from '~/decorators/role-guard.decorator';

@ApiTags('Owner - Stores')
@Controller('stores')
@UseGuards(JwtGuard)
@RolesGuard('STORE_OWNER')
@ApiBearerAuth()
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiOperation({ summary: 'List all stores' })
  @ApiResponse({ status: 200, type: [StoreResponseDto] })
  async findAll(
    @CurrentUser() user: UserResponseDto,
  ): Promise<StoreResponseDto[]> {
    const stores = await this.storeService.findByCondition({
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
    const creationData = new StoreCreationEntityMapper().map(storeCreationDto);
    const store = await this.storeService.create(creationData);
    return new StoreResponseMapper().map(store);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a store' })
  @ApiResponse({ status: 200, type: StoreResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateStoreDto: StoreUpdatingDto,
  ): Promise<StoreResponseDto> {
    const store = await this.storeService.update(id, updateStoreDto);
    return new StoreResponseMapper().map(store);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Inactive a store' })
  @ApiResponse({ status: 200 })
  async softDelete(@Param('id') id: string): Promise<void> {
    return this.storeService.softDelete(id);
  }
}
