import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { IsEmail } from 'class-validator';
import { UserStatus } from '~/shares/consts/enums';
import { RoleEntity, StoreEntity } from '.';
import { BaseEntity } from './BaseEntity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity<UserEntity> {
  @ApiProperty({ required: true, maxLength: 100, uniqueItems: true })
  @Property({ length: 100 })
  @Unique()
  userName!: string;

  @ApiProperty({ maxLength: 255 })
  @Property({ length: 255 })
  @Unique()
  description?: string;

  @ApiProperty({ required: false, maxLength: 100 })
  @Property({ length: 100, nullable: true })
  firstName?: string;

  @ApiProperty({ required: false, maxLength: 100 })
  @Property({ length: 100, nullable: true })
  lastName?: string;

  @ApiProperty({ required: false, maxLength: 100 })
  @Property({ length: 100, nullable: true })
  password?: string;

  @ApiProperty({ required: true, maxLength: 100, uniqueItems: true })
  @Property({ length: 100 })
  @IsEmail()
  @Unique()
  email!: string;

  @ApiProperty({ required: true, maxLength: 100 })
  @Property({ default: false })
  emailVerified?: boolean = false;

  @ApiProperty({ required: false, maxLength: 100 })
  @Property({ nullable: true })
  verifyToken?: string;

  @ManyToOne(() => RoleEntity)
  role!: RoleEntity;

  @ManyToMany(() => StoreEntity, 'owners')
  stores = new Collection<StoreEntity>(this);

  @ApiProperty({ required: false })
  @Enum({ items: () => UserStatus, nullable: false })
  status?: UserStatus = UserStatus.ACTIVE;

  public getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  public isActive() {
    return !!this.emailVerified && this.status === UserStatus.ACTIVE;
  }
}
