import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { LocationStatus } from '~/shares/consts/enums';
import { GeoRefEntity, StoreEntity } from '.';
import { BaseEntity } from './BaseEntity';

@Entity({ tableName: 'locations' })
export class LocationEntity extends BaseEntity<LocationEntity> {
  @Property({ length: 255 })
  name!: string;

  @Property({ length: 1000 })
  address!: string;

  @ManyToOne(() => GeoRefEntity, { nullable: true })
  geoRef?: GeoRefEntity;

  @Property({ length: 100, nullable: true })
  openTime?: string;

  @Property({ length: 100, nullable: true })
  closeTime?: string;

  @Enum({ items: () => LocationStatus })
  status?: LocationStatus = LocationStatus.ACTIVE;

  @ManyToOne(() => StoreEntity)
  store!: StoreEntity;
}
