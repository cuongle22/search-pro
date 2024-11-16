/* eslint-disable */

import type { EntityManager } from '@mikro-orm/core';
import { GeoRefEntity } from '~/entities';
import { BaseSeeder } from './BaseSeeder';
import * as fs from 'fs';
import * as path from 'path';

export class GeoRefSeeder extends BaseSeeder {
  async run(em: EntityManager): Promise<void> {
    const filePath = path.resolve(__dirname, '../resources/geo-refs.json');
    const geoRefData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const geoRefEntities: GeoRefEntity[] = [];
    for (const item of geoRefData) {
      const geoRef = em.create(GeoRefEntity, {
        country: 'America',
        zipCode: item.zip_code,
        uspsCity: item.usps_city,
        stuspsCode: item.stusps_code,
        steName: item.ste_name,
        population: item.population ?? 0,
        primaryCotyCode: item.primary_coty_code,
        primaryCotyName: item.primary_coty_name,
        timezone: item.timezone,
      });
      geoRefEntities.push(geoRef);
    }
    await em.persistAndFlush(geoRefEntities);
  }
}
