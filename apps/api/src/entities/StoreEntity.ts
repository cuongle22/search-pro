import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { StoreStatus } from '~/share/consts/enums';
import { BaseEntity } from './BaseEntity';
import { UserEntity, LocationEntity } from '.';

@Entity({ tableName: 'stores' })
export class StoreEntity extends BaseEntity<StoreEntity> {
  @Property({ length: 255 })
  name!: string;

  @Property({ length: 1000, nullable: true })
  description?: string;

  @Property({ length: 50, nullable: true })
  primaryPhone?: string;

  @Property({ length: 50, nullable: true })
  secondaryPhone?: string;

  @Property({ length: 100, nullable: true })
  email?: string;

  @Property({ length: 255, nullable: true })
  website?: string;

  @Enum({ items: () => StoreStatus, nullable: false })
  status?: StoreStatus = StoreStatus.ACTIVE;

  @OneToMany(() => LocationEntity, 'store')
  locations = new Collection<LocationEntity>(this);

  @ManyToMany(() => UserEntity, 'stores', {
    owner: true,
    joinColumn: 'store_id',
    inverseJoinColumn: 'user_id',
  })
  owners = new Collection<UserEntity>(this);
}
