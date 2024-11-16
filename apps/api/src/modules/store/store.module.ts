import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { JwtService } from '@nestjs/jwt';
import { CustomGuard } from '~/decorators/custom-guard.decorator';

@Module({
  imports: [],
  providers: [StoreService, JwtService, CustomGuard],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
