import { QuoteEntity } from '~/entities';
import { QuoteResponseDto } from '~/share/dtos';
import { BaseMapper } from '../base/BaseMapper';

export class QuoteResponseMapper extends BaseMapper<
  QuoteEntity,
  QuoteResponseDto
> {
  map(source: QuoteEntity): QuoteResponseDto {
    const quoteDto: QuoteResponseDto = {
      id: source.id,
      status: source.status,
      product: {
        id: source.productLocation.product.id,
        sku: source.productLocation.product.sku,
        name: source.productLocation.product.name,
      },
      store: {
        id: source.store.id,
        name: source.store.name,
        phone: source.store.primaryPhone ?? '',
      },
      location: {
        id: source.productLocation.location.id,
        price: source.productLocation.price,
        name: source.productLocation.location.name,
        address: source.productLocation.location.address,
        openTime: source.productLocation.location.openTime ?? 'N/A',
        closeTime: source.productLocation.location.closeTime ?? 'N/A',
      },
    };
    return quoteDto;
  }
}
