import { FilterQuery } from '@mikro-orm/core';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductLocationEntity } from '~/entities';
import { ProductLocationResponseMapper } from '~/mappers/responses/ProductLocationResponseMapper';
import { ProductFilterDto } from '~/share/dtos';
import { ProductLocationResponseDto } from '~/share/dtos/product-location-response.dto';
import { GeoRefService } from '../share/geo-ref/geo-ref.service';
import { ProductService } from './product.service';
import { ProductDetailFilterDto } from '~/share/dtos/product-detail-filter.dto';

@ApiTags('App - Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly geoRefService: GeoRefService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List products' })
  @ApiResponse({ status: 200, type: [ProductLocationResponseDto] })
  async searchProducts(
    @Query() query: ProductFilterDto,
  ): Promise<ProductLocationResponseDto[]> {
    const geoRef = await this.geoRefService.findOneByZipCodeAndSteName(
      query.zipCode,
      query.steName,
    );
    const conditions: FilterQuery<ProductLocationEntity> = {
      location: {
        geoRef: geoRef,
      },
    };
    if (query.productName) {
      conditions.product = {
        name: { $like: `%${query.productName}%` },
      };
    }
    const productLocations =
      await this.productService.findByCondition(conditions);
    return new ProductLocationResponseMapper().mapArray(productLocations);
  }

  @Get(':productLocationId')
  @ApiOperation({ summary: 'Product detail by location' })
  @ApiResponse({ status: 200, type: ProductLocationResponseDto })
  async getProduct(
    @Param('productLocationId') productLocationId: string,
    @Query() query: ProductDetailFilterDto,
  ): Promise<ProductLocationResponseDto | null> {
    const geoRef = await this.geoRefService.findOneByZipCodeAndSteName(
      query.zipCode,
      query.steName,
    );
    const conditions: FilterQuery<ProductLocationEntity> = {
      location: {
        geoRef: geoRef?.id,
      },
      id: productLocationId,
    };
    const store = await this.productService.findByProductLocationId(conditions);
    if (!store) {
      throw new NotFoundException('Product not found');
    }
    return new ProductLocationResponseMapper().map(store);
  }
}
