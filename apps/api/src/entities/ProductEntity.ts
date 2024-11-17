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
import { AttachmentEntity, ProductLocationEntity, StoreEntity } from '.';
import { BaseEntity } from './BaseEntity';
import { IsOptional } from 'class-validator';

@Entity({ tableName: 'products' })
@Unique({ properties: ['sku', 'store'] })
export class ProductEntity extends BaseEntity<ProductEntity> {
  @Property({ length: 100 })
  @Unique()
  sku!: string;

  @Property({ length: 255, nullable: true })
  name!: string;

  @Property({ nullable: true, type: types.json })
  @IsOptional()
  keywords?: string[];

  @Property({ length: 1000, nullable: true })
  description?: string;

  @ManyToOne(() => StoreEntity)
  store!: StoreEntity;

  @Enum({ items: () => ProductStatus, nullable: false })
  @IsOptional()
  status?: ProductStatus = ProductStatus.ACTIVE;

  @OneToMany(() => ProductLocationEntity, 'product')
  productLocations = new Collection<ProductLocationEntity>(this);

  @OneToMany(() => AttachmentEntity, 'product')
  attachments = new Collection<AttachmentEntity>(this);
}
