import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  GoneException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '~/decorators';
import { RolesGuard } from '~/decorators/role-guard.decorator';
import { StoreCreationEntityMapper } from '~/mappers/entities/StoreCreationEntityMapper';
import { StoreResponseMapper } from '~/mappers/responses/StoreResponseMapper';
import { JwtGuard } from '~/modules/share/auth/guard';
import {
  StoreCreationDto,
  StoreOwnerCreationDto,
  StoreUpdatingDto,
} from '~/share/dtos';
import { StoreResponseDto } from '~/share/dtos/store-response.dto';
import { UserResponseDto } from '~/share/dtos/user-response.dto';
import AdminUserService from '../user/admin-user.service';
import { AdminStoreService } from './admin-store.service';
// import * from 'multer';

@ApiTags('System - Stores')
@Controller('admin/stores')
@RolesGuard('SUPER_ADMIN')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class AdminStoreController {
  constructor(
    private readonly adminStoreService: AdminStoreService,
    private readonly adminUserService: AdminUserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all stores' })
  @ApiResponse({ status: 200, type: [StoreResponseDto] })
  async getStores(): Promise<StoreResponseDto[]> {
    const stores = await this.adminStoreService.findByCondition({});
    return new StoreResponseMapper().mapArray(stores);
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'Get store detail' })
  @ApiResponse({ status: 200, type: StoreResponseDto })
  async getStore(
    @CurrentUser() _: UserResponseDto,
    @Param('storeId') storeId: string,
  ): Promise<StoreResponseDto | null> {
    const store = await this.adminStoreService.findById(storeId);
    if (!store) {
      return null;
    }
    return new StoreResponseMapper().map(store);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new store' })
  @ApiBody({ description: 'Create a new store', type: StoreCreationDto })
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     dest: './uploads',
  //     limits: { fileSize: 5 * 1024 * 1024 },
  //     fileFilter: (req, file, cb) => {
  //       const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  //       if (allowedMimeTypes.includes(file.mimetype)) {
  //         cb(null, true);
  //       } else {
  //         cb(
  //           new BadRequestException(
  //             'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
  //           ),
  //           false,
  //         );
  //       }
  //     },
  //   }),
  // )
  @ApiResponse({ status: 201, type: StoreResponseDto })
  async createStore(
    @CurrentUser() user: UserResponseDto,
    @Body() storeCreationDto: StoreCreationDto,
    // @UploadedFile() file: Express.Multer.File,
  ): Promise<StoreResponseDto> {
    // if (!file) {
    //   throw new BadRequestException('Image is required');
    // }
    const creationData = new StoreCreationEntityMapper().map(storeCreationDto);
    const store = await this.adminStoreService.create({
      ...creationData,
      createdBy: user.id,
    });
    return new StoreResponseMapper().map(store);
  }

  @Post(':storeId/owners')
  @ApiOperation({ summary: 'Create store owner' })
  @ApiResponse({ status: 201, type: StoreResponseDto })
  async createStoreOwner(
    @CurrentUser() user: UserResponseDto,
    @Param('storeId') storeId: string,
    @Body() storeOwnerDto: StoreOwnerCreationDto,
  ): Promise<StoreResponseDto> {
    const owner = await this.adminUserService.findByEmail(storeOwnerDto.email);
    if (owner) {
      throw new ConflictException('User with provided email already exists');
    }

    const store = await this.adminStoreService.findById(storeId);
    if (!store) {
      throw new GoneException('Store not found');
    }
    await this.adminStoreService.createOwner(store, storeOwnerDto);
    return new StoreResponseMapper().map(store);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a store' })
  @ApiResponse({ status: 200, type: StoreResponseDto })
  async updateStore(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
    @Body() updateStoreDto: StoreUpdatingDto,
  ): Promise<StoreResponseDto> {
    const store = await this.adminStoreService.update(id, {
      ...updateStoreDto,
      updatedBy: user.id,
    });
    return new StoreResponseMapper().map(store);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Inactive a store' })
  @ApiResponse({ status: 200 })
  async deleteStore(@Param('id') id: string): Promise<void> {
    return this.adminStoreService.softDelete(id);
  }
}
