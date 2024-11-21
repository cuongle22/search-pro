import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join as pathJoin } from 'path';
import { AdminModule } from './modules/admin/admin.module';
import { FileController } from './modules/file/file.controller';
import { FileModule } from './modules/file/file.module';
import { ProductModule } from './modules/product/product.module';
import { QuoteModule } from './modules/quote/quote.module';
import { GeoRefModule } from './modules/share/geo-ref/geo-ref.module';
import { OrmModule } from './modules/share/orm/orm.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    OrmModule,
    GeoRefModule,
    AdminModule,
    UserModule,
    ProductModule,
    QuoteModule,
    // StoreModule,
    FileModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [FileController],
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
function join(__dirname: string, arg1: string, arg2: string): string {
  return pathJoin(__dirname, arg1, arg2);
}
