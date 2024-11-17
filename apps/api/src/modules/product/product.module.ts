import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { JwtService } from '@nestjs/jwt';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import { GeoRefService } from '../share/geo-ref/geo-ref.service';
import { GeoRefModule } from '../share/geo-ref/geo-ref.module';

@Module({
  imports: [GeoRefModule],
  providers: [ProductService, JwtService, CustomGuard, GeoRefService],
  controllers: [ProductController],
  exports: [ProductService, GeoRefService],
})
export class ProductModule {}
