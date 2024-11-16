import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/admin/user/user.module';
import { OrmModule } from './modules/common/orm/orm.module';
import { StoreModule } from './modules/store/store.module';
import { UserModule as AppUserModule } from './modules/user/user.module';

@Module({
  imports: [
    OrmModule,
    UserModule,
    AppUserModule,
    StoreModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
