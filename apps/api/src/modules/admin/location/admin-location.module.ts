import { Module } from '@nestjs/common';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import { AdminLocationController } from './admin-location.controller';
import { AdminLocationService } from './admin-location.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  providers: [AdminLocationService, JwtService, CustomGuard],
  controllers: [AdminLocationController],
  exports: [AdminLocationService],
})
export class AdminLocationModule {}
