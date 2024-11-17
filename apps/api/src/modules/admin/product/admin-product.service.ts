import { AutoPath, EntityManager, RequiredEntityData } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ProductEntity, ProductLocationEntity } from '~/entities';
import { ProductStatus } from '~/share/consts/enums';
import { LocationDto } from '~/share/dtos/product-creation.dto';

@Injectable()
export class AdminProductService {
  public defaultPopulate: AutoPath<ProductLocationEntity, any> = [
    'product',
    'product.attachments',
    'location',
    'location.store',
  ] as never[];

  public defaultPopulateProduct: AutoPath<ProductEntity, any> = [
    'store',
    'productLocations',
    'attachments',
    'productLocations.location',
  ] as never[];
  constructor(private readonly em: EntityManager) {}

  private getPopulates(populate?: string[]) {
    if (populate) {
      return populate as never[];
    }
    return this.defaultPopulate as never[];
  }

  async findByProductAndLocation(
    productId: string,
    locationId: string,
    populate?: string[],
  ) {
    return await this.em.findOne(
      ProductLocationEntity,
      { product: productId, location: locationId },
      { populate: this.getPopulates(populate) },
    );
  }

  async findByLocation(
    locationId: string,
    populate?: string[],
  ): Promise<ProductLocationEntity[]> {
    return this.em.find(
      ProductLocationEntity,
      { location: locationId },
      { populate: this.getPopulates(populate) },
    );
  }

  async findProductById(id: string): Promise<ProductEntity> {
    return this.em.findOneOrFail(ProductEntity, id, {
      populate: this.defaultPopulateProduct as never[],
    });
  }

  async findByStore(
    storeId: string,
    populate?: string[],
  ): Promise<ProductLocationEntity[]> {
    return this.em.find(
      ProductLocationEntity,
      { location: { store: storeId } },
      { populate: this.getPopulates(populate) },
    );
  }

  async create(
    productData: RequiredEntityData<ProductEntity>,
    productLocationData: LocationDto[],
  ): Promise<ProductEntity> {
    const product = this.em.create(ProductEntity, productData);
    const productLocations = productLocationData.map((location) =>
      this.em.create(ProductLocationEntity, {
        location: location.locationId,
        product: product,
        price: location.price,
      }),
    );
    await this.em.persistAndFlush(productLocations);
    return product;
  }

  async deleteProductLocation(
    productId: string,
    locationId: string,
  ): Promise<void> {
    await this.em.nativeDelete(ProductLocationEntity, {
      product: productId,
      location: locationId,
    });
  }

  async softDelete(id: string): Promise<void> {
    const product = await this.em.findOneOrFail(ProductEntity, id);
    product.status = ProductStatus.INACTIVE;
    await this.em.persistAndFlush(product);
  }
}
