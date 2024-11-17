import { Module } from '@nestjs/common';
import { GeoRefService } from './geo-ref.service';
import { GeoRefController } from './geo-ref.controller';

@Module({
  imports: [],
  providers: [GeoRefService],
  controllers: [GeoRefController],
  exports: [GeoRefService],
})
export class GeoRefModule {}
