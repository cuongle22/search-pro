import {
  AutoPath,
  EntityManager,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { RoleEntity, StoreEntity, UserEntity } from '~/entities';
import { StoreStatus, UserRole, UserStatus } from '~/shares/consts/enums';
import { StoreOwnerCreationDto } from '~/shares/dtos';
import * as argon from 'argon2';

@Injectable()
export class AdminStoreService {
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

  async findById(id: string, populate?: string[]) {
    return await this.em.findOne(
      StoreEntity,
      { id },
      { populate: this.getPopulates(populate) },
    );
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
    updateStoreDto: Partial<StoreEntity>,
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

  async createOwner(
    store: StoreEntity,
    storeOwnerDto: StoreOwnerCreationDto,
  ): Promise<StoreEntity> {
    const roleAppUser = await this.em.findOneOrFail(RoleEntity, {
      role: UserRole.STORE_OWNER,
    });
    const password = await argon.hash(new Date().toUTCString());
    const owner = this.em.create(UserEntity, {
      ...storeOwnerDto,
      status: storeOwnerDto.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
      userName: storeOwnerDto.email,
      role: roleAppUser.id,
      password,
      emailVerified: true,
    });
    store.owners.add(owner);

    await this.em.persistAndFlush(store);
    return store;
  }
}
