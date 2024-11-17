import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
  types,
  Unique,
} from '@mikro-orm/core';
import { ProductStatus } from '~/share/consts/enums';
import { ProductLocationEntity, StoreEntity } from '.';
import { BaseEntity } from './BaseEntity';

@Entity({ tableName: 'products' })
@Unique({ properties: ['sku', 'store'] })
export class ProductEntity extends BaseEntity<ProductEntity> {
  @Property({ length: 100 })
  @Unique()
  sku!: string;

  @Property({ length: 255, nullable: true })
  name?: string;

  @Property({ type: types.json })
  keywords!: string[];

  @Property({ length: 1000, nullable: true })
  description?: string;

  @ManyToOne(() => StoreEntity)
  store!: StoreEntity;

  @OneToMany(() => ProductLocationEntity, 'product')
  productLocations = new Collection<ProductLocationEntity>(this);

  @Enum({ items: () => ProductStatus, nullable: false })
  status?: ProductStatus = ProductStatus.ACTIVE;
}
