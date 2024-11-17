import { Module } from '@nestjs/common';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import { AdminProductController } from './admin-product.controller';
import { AdminProductService } from './admin-product.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  providers: [AdminProductService, JwtService, CustomGuard],
  controllers: [AdminProductController],
  exports: [AdminProductService],
})
export class AdminProductModule {}
