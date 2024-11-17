import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '~/decorators';
import { RolesGuard } from '~/decorators/role-guard.decorator';
import { ProductCreationEntityMapper } from '~/mappers/entities/ProductCreationEntityMapper';
import { ProductResponseMapper } from '~/mappers/responses/ProductResponseMapper';
import { JwtGuard } from '~/modules/share/auth/guard';
import { ProductResponseDto } from '~/share/dtos';
import { ProductCreationDto } from '~/share/dtos/product-creation.dto';
import { ProductLocationResponseDto } from '~/share/dtos/product-location-response.dto';
import { UserResponseDto } from '~/share/dtos/user-response.dto';
import { ProductLocationResponseMapper } from '../../../mappers/responses/ProductLocationResponseMapper';
import { AdminProductService } from './admin-product.service';

@ApiTags('System - Products')
@Controller('admin/stores/:storeId')
@RolesGuard('SUPER_ADMIN')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class AdminProductController {
  constructor(private readonly adminProductService: AdminProductService) {}

  @Get('products')
  @ApiOperation({ summary: 'Get products by store' })
  @ApiResponse({ status: 200, type: [ProductLocationResponseDto] })
  async getProductsByStore(
    @Param('storeId') storeId: string,
  ): Promise<ProductLocationResponseDto[]> {
    const productLocations =
      await this.adminProductService.findByStore(storeId);
    return new ProductLocationResponseMapper().mapArray(productLocations);
  }

  @Get('locations/:locationId/products')
  @ApiOperation({ summary: 'Get products by location' })
  @ApiResponse({ status: 200, type: [ProductLocationResponseDto] })
  async getProductsByLocation(
    @Param('storeId') _: string,
    @Param('locationId') locationId: string,
  ): Promise<ProductLocationResponseDto[]> {
    const productLocations =
      await this.adminProductService.findByLocation(locationId);
    return new ProductLocationResponseMapper().mapArray(productLocations);
  }

  @Get('locations/:locationId/products/:productId')
  @ApiOperation({ summary: 'Get product detail in a location' })
  @ApiResponse({ status: 200, type: ProductLocationResponseDto })
  async getProductByProductId(
    @Param('productId') productId: string,
    @Param('locationId') locationId: string,
  ): Promise<ProductLocationResponseDto | null> {
    const productLocation =
      await this.adminProductService.findByProductAndLocation(
        productId,
        locationId,
      );
    if (!productLocation) {
      return null;
    }
    return new ProductLocationResponseMapper().map(productLocation);
  }

  //TODO:
  @Post('products')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, type: ProductCreationDto })
  async create(
    @Param('storeId') storeId: string,
    @CurrentUser() user: UserResponseDto,
    @Body() locationCreationDto: ProductCreationDto,
  ): Promise<ProductResponseDto> {
    const creationData = new ProductCreationEntityMapper().map(
      locationCreationDto,
      { storeId, createdBy: user.id },
    );
    const product = await this.adminProductService.create(
      creationData,
      locationCreationDto.productLocations,
    );
    const updatedProduct = await this.adminProductService.findProductById(
      product.id,
    );
    return new ProductResponseMapper().map(updatedProduct);
  }

  @Delete('locations/:locationId/products/:productId')
  @ApiOperation({ summary: 'Delete a product in a location' })
  @ApiResponse({ status: 200 })
  async deleteLocation(
    @Param('productId') productId: string,
    @Param('locationId') locationId: string,
  ): Promise<void> {
    return this.adminProductService.deleteProductLocation(
      productId,
      locationId,
    );
  }
}
