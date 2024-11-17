import { ProductEntity } from '~/entities';
import { BaseMapper } from '../base/BaseMapper';
import { ProductResponseDto } from '~/share/dtos/product-response.dto';

export class ProductResponseMapper extends BaseMapper<
  ProductEntity,
  ProductResponseDto
> {
  map(source: ProductEntity): ProductResponseDto {
    const productDto: ProductResponseDto = {
      id: source.id,
      sku: source.sku,
      name: source.name,
      keywords: source.keywords,
      description: source.description,
      store: {
        id: source.store.id,
        name: source.store.name,
      },
      attachments: source.attachments?.map((attachment) => ({
        id: attachment.id,
        name: attachment.name,
        type: attachment.type,
        url: attachment.url,
      })),
      locations: source.productLocations?.map((productLocation) => ({
        id: productLocation?.location.id,
        zipCode: productLocation?.location?.geoRef.zipCode,
        steName: productLocation?.location?.geoRef.steName,
        price: productLocation.price,
      })),
    };
    return productDto;
  }
}
