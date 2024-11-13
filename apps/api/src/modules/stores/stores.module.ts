import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { JwtService } from '@nestjs/jwt';
import { CustomGuard } from '~/decorators/custom-guard.decorator';

@Module({
  imports: [],
  providers: [StoresService, JwtService, CustomGuard],
  controllers: [StoresController],
  exports: [StoresService],
})
export class StoresModule {}
