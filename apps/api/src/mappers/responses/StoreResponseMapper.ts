import { StoreEntity } from '~/entities';
import { StoreStatus } from '~/share/consts/enums';
import { StoreResponseDto } from '~/share/dtos/store-response.dto';
import { BaseMapper } from '../base/BaseMapper';

export class StoreResponseMapper extends BaseMapper<
  StoreEntity,
  StoreResponseDto
> {
  map(source: StoreEntity): StoreResponseDto {
    const storeDto: StoreResponseDto = {
      id: source.id,
      name: source.name,
      description: source.description ?? '',
      primaryPhone: source.primaryPhone ?? '',
      secondaryPhone: source.secondaryPhone ?? '',
      email: source.email ?? '',
      website: source.website ?? '',
      status: source.status ?? StoreStatus.INACTIVE,
      locations: source.locations.map((location) => ({
        id: location.id,
        name: location.name,
        address: location.address,
      })),
      owners: source.owners.map((owner) => ({
        id: owner.id,
        userName: owner.userName,
        email: owner.email,
      })),
    };
    return storeDto;
  }
}
