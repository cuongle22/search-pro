import { RequiredEntityData } from '@mikro-orm/core';
import { ProductEntity } from '~/entities';
import { ProductStatus } from '~/share/consts/enums';
import { ProductCreationDto } from '~/share/dtos/product-creation.dto';
import { CreateEntityMapper } from '../base/CreateEntityMapper';

interface ProductCreationOptions {
  createdBy: string;
  storeId: string;
}

export class ProductCreationEntityMapper extends CreateEntityMapper<
  ProductCreationDto,
  ProductEntity,
  ProductCreationOptions
> {
  map(
    source: ProductCreationDto,
    options: ProductCreationOptions,
  ): RequiredEntityData<ProductEntity> {
    return {
      sku: source.sku,
      name: source.name,
      keywords: source.keywords,
      description: source.description,
      store: options.storeId,
      createdBy: options.createdBy,
      status: ProductStatus.ACTIVE,
    };
  }
}
