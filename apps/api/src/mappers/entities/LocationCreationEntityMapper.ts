import { RequiredEntityData } from '@mikro-orm/core';
import { LocationEntity } from '~/entities';
import { LocationStatus } from '~/share/consts/enums';
import { LocationCreationDto } from '~/share/dtos/store-location-creation.dto';
import { CreateEntityMapper } from '../base/CreateEntityMapper';

interface LocationCreationOptions {
  createdBy: string;
  storeId: string;
}

export class LocationCreationEntityMapper extends CreateEntityMapper<
  LocationCreationDto,
  LocationEntity,
  LocationCreationOptions
> {
  map(
    source: LocationCreationDto,
    options: LocationCreationOptions,
  ): RequiredEntityData<LocationEntity> {
    return {
      name: source.name,
      address: source.address,
      openTime: source.openTime,
      closeTime: source.closeTime,
      geoRef: source.geoRefId,
      store: options.storeId,
      createdBy: options.createdBy,
      status: LocationStatus.ACTIVE,
    };
  }
}
