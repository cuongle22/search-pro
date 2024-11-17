import {
  AutoPath,
  EntityManager,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { StoreEntity } from '~/entities';
import { StoreStatus } from '~/share/consts/enums';
import { StoreUpdatingDto } from '~/share/dtos';

@Injectable()
export class StoreService {
  public defaultPopulate: AutoPath<StoreEntity, any> = [
    'locations',
    'owners',
  ] as never[];
  constructor(private readonly em: EntityManager) {}

  private getPopulates(populate?: string[]) {
    if (populate) {
      return populate as never[];
    }
    return this.defaultPopulate as never[];
  }

  async findAll(populate?: string[]): Promise<StoreEntity[]> {
    return this.em.find(
      StoreEntity,
      {},
      { populate: this.getPopulates(populate) },
    );
  }

  async findByCondition(
    condition: FilterQuery<StoreEntity>,
    populate?: string[],
  ): Promise<StoreEntity[]> {
    return this.em.find(StoreEntity, condition, {
      populate: this.getPopulates(populate),
    });
  }

  async create(
    storeData: RequiredEntityData<StoreEntity>,
  ): Promise<StoreEntity> {
    const store = this.em.create(StoreEntity, storeData);
    await this.em.persistAndFlush(store);
    return store;
  }

  async update(
    id: string,
    updateStoreDto: StoreUpdatingDto,
  ): Promise<StoreEntity> {
    const store = await this.em.findOneOrFail(StoreEntity, id);
    store.assign(updateStoreDto);
    await this.em.persistAndFlush(store);
    return store;
  }

  async softDelete(id: string): Promise<void> {
    const store = await this.em.findOneOrFail(StoreEntity, id);
    store.status = StoreStatus.INACTIVE;
    await this.em.persistAndFlush(store);
  }
}
