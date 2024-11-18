import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { OrmModule } from './modules/share/orm/orm.module';
import { StoreModule } from './modules/store/store.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { GeoRefModule } from './modules/share/geo-ref/geo-ref.module';
import { ProductModule } from './modules/product/product.module';
import { QuoteModule } from './modules/quote/quote.module';

@Module({
  imports: [
    OrmModule,
    GeoRefModule,
    AdminModule,
    UserModule,
    ProductModule,
    QuoteModule,
    StoreModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
        }),
    },
  ],
})
export class AppModule {}
