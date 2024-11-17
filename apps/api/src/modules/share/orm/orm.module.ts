import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import * as entities from '../../../entities';
import mikroOrmConfig from 'config/mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    MikroOrmModule.forFeature({
      entities: Object.values(entities),
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
