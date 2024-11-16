import { Entity, PrimaryKey, Property, types } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'geo_refs' })
export class GeoRefEntity {
  @PrimaryKey({ type: types.uuid })
  id: string = uuidv4();

  @Property({ length: 100 })
  country!: string;

  @Property({ length: 100 })
  zipCode!: string;

  @Property({ length: 100 })
  uspsCity!: string;

  @Property({ length: 100 })
  stuspsCode!: string;

  @Property({ length: 100 })
  steName!: string;

  @Property({ length: 100 })
  population!: number;

  @Property({ length: 100 })
  primaryCotyCode!: string;

  @Property({ length: 100 })
  primaryCotyName!: string;

  @Property({ length: 100 })
  timezone!: string;
}
