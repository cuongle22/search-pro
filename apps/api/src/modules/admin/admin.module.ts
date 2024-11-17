import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import TokenService from '../share/auth/token.service';
import { OrmModule } from '../share/orm/orm.module';
import { AdminStoreController } from './store/admin-store.controller';
import { AdminStoreModule } from './store/admin-store.module';
import { AdminUserController } from './user/admin-user.controller';
import { AdminUserModule } from './user/admin-user.module';
import AdminUserService from './user/admin-user.service';
import { AdminStoreService } from './store/admin-store.service';
import { AdminLocationModule } from './location/admin-location.module';
import { AdminLocationController } from './location/admin-location.controller';
import { AdminLocationService } from './location/admin-location.service';
import { AdminProductModule } from './product/admin-product.module';
import { AdminProductController } from './product/admin-product.controller';
import { AdminProductService } from './product/admin-product.service';

@Module({
  imports: [
    OrmModule,
    AdminUserModule,
    AdminStoreModule,
    AdminLocationModule,
    AdminProductModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [
    AdminUserController,
    AdminStoreController,
    AdminLocationController,
    AdminProductController,
  ],
  providers: [
    TokenService,
    CustomGuard,
    JwtService,
    AdminUserService,
    AdminStoreService,
    AdminLocationService,
    AdminProductService,
  ],
})
export class AdminModule {}
