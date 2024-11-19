import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { QuoteEntity, UserEntity } from '.';
import { BaseEntity } from './BaseEntity';

@Entity({ tableName: 'comments' })
export class CommentEntity extends BaseEntity<CommentEntity> {
  @ManyToOne(() => QuoteEntity)
  quote!: QuoteEntity;

  @ManyToOne(() => UserEntity)
  sender!: UserEntity;

  @Property({ nullable: true })
  outOfStock?: boolean;

  @Property({ length: 1000, nullable: true })
  price?: number;

  @Property({ length: 1000, nullable: true })
  quantity?: number;

  @Property({ length: 1000, nullable: true })
  content?: string;
}
