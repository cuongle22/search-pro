import {
  AutoPath,
  EntityManager,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { LocationEntity } from '~/entities';
import { LocationStatus } from '~/share/consts/enums';

@Injectable()
export class AdminLocationService {
  public defaultPopulate: AutoPath<LocationEntity, any> = [
    'store',
    'geoRef',
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
      LocationEntity,
      { id },
      { populate: this.getPopulates(populate) },
    );
  }

  async findAll(populate?: string[]): Promise<LocationEntity[]> {
    return this.em.find(
      LocationEntity,
      {},
      { populate: this.getPopulates(populate) },
    );
  }

  async findByCondition(
    condition: FilterQuery<LocationEntity>,
    populate?: string[],
  ): Promise<LocationEntity[]> {
    return this.em.find(LocationEntity, condition, {
      populate: this.getPopulates(populate),
    });
  }

  async create(
    locationData: RequiredEntityData<LocationEntity>,
  ): Promise<LocationEntity> {
    const location = this.em.create(LocationEntity, locationData);
    await this.em.persistAndFlush(location);
    return location;
  }

  async update(
    id: string,
    updateLocationDto: Partial<LocationEntity>,
  ): Promise<LocationEntity> {
    const location = await this.em.findOneOrFail(LocationEntity, id);
    location.assign(updateLocationDto);
    await this.em.persistAndFlush(location);
    return location;
  }

  async softDelete(id: string): Promise<void> {
    const location = await this.em.findOneOrFail(LocationEntity, id);
    location.status = LocationStatus.INACTIVE;
    await this.em.persistAndFlush(location);
  }
}
