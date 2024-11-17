import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
} from '@mikro-orm/core';
import { QuoteStatus } from '~/share/consts/enums';
import {
  CommentEntity,
  ContactEntity,
  ProductLocationEntity,
  StoreEntity,
  UserEntity,
} from '.';
import { BaseEntity } from './BaseEntity';

@Entity({ tableName: 'quotes' })
export class QuoteEntity extends BaseEntity<QuoteEntity> {
  @ManyToOne(() => ProductLocationEntity)
  productLocation!: ProductLocationEntity;

  @ManyToOne(() => StoreEntity)
  store!: StoreEntity;

  @ManyToOne(() => UserEntity)
  requestor!: UserEntity;

  @ManyToOne(() => ContactEntity)
  contact!: ContactEntity;

  @OneToMany(() => CommentEntity, 'quote')
  comments = new Collection<CommentEntity>(this);

  @Enum({ items: () => QuoteStatus, nullable: false })
  status?: QuoteStatus = QuoteStatus.WAITING;
}
