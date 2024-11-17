import { ProductLocationEntity } from '~/entities';
import { ProductLocationResponseDto } from '~/share/dtos/product-location-response.dto';
import { BaseMapper } from '../base/BaseMapper';

export class ProductLocationResponseMapper extends BaseMapper<
  ProductLocationEntity,
  ProductLocationResponseDto
> {
  map(source: ProductLocationEntity): ProductLocationResponseDto {
    const productLocationDto: ProductLocationResponseDto = {
      id: source.id,
      productId: source.product.id,
      sku: source.product.sku,
      name: source.product.name,
      keywords: source.product.keywords,
      store: {
        id: source.location.store.id,
        name: source.location.store.name,
      },
      location: {
        id: source.location.id,
        zipCode: source.location.geoRef.zipCode,
        steName: source.location.geoRef.steName,
        price: source.price,
      },
      attachments: source.product.attachments?.map((attachment) => ({
        id: attachment.id,
        name: attachment.name,
        type: attachment.type,
        url: attachment.url,
      })),
    };
    return productLocationDto;
  }
}
