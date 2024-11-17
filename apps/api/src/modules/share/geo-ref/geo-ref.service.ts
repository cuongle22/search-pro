import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { GeoRefEntity } from '~/entities';

@Injectable()
export class GeoRefService {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string) {
    return await this.em.findOne(GeoRefEntity, { id });
  }

  async findByCondition(
    condition: FilterQuery<GeoRefEntity>,
  ): Promise<GeoRefEntity[]> {
    return this.em.find(GeoRefEntity, condition, { limit: 25 }); //FIXME: config this value
  }
}
