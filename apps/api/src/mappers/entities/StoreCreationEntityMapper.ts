import { StoreCreationDto } from '~/share/dtos';
import { CreateEntityMapper } from '../base/CreateEntityMapper';
import { StoreEntity } from '~/entities';
import { RequiredEntityData } from '@mikro-orm/core';
import { StoreStatus } from '~/share/consts/enums';

interface StoreCreationOptions {
  owner: string;
}

export class StoreCreationEntityMapper extends CreateEntityMapper<
  StoreCreationDto,
  StoreEntity,
  StoreCreationOptions
> {
  map(
    source: StoreCreationDto,
    options?: StoreCreationOptions,
  ): RequiredEntityData<StoreEntity> {
    return {
      name: source.name,
      description: source.description,
      primaryPhone: source.primaryPhone,
      secondaryPhone: source.secondaryPhone,
      email: source.email,
      website: source.website,
      status: StoreStatus.ACTIVE,
      locations: [],
      owners: options ? [options.owner] : [],
      createdBy: options?.owner,
    };
  }
}
