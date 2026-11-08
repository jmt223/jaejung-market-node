import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsModule } from './admins/admins.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { NoticesModule } from './notices/notices.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT') ?? 3306),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        timezone: config.get('DB_TIMEZONE') ?? '+09:00',
        charset: 'utf8mb4',
        // MySQL 8은 caching_sha2_password 라서 DB 통신을 암호화해서 보냄 (스프링 sslMode=REQUIRED 랑 같음)
        ssl: { rejectUnauthorized: false },
        autoLoadEntities: true,
        // 스프링이랑 같은 sampledb 테이블 그대로 씀. 이거 true로 하면 테이블이 바뀔수 있어서 꼭 false
        synchronize: false,
        bigNumberStrings: false,
        dateStrings: ['DATE'],
      }),
    }),
    AuthModule,
    UsersModule,
    AdminsModule,
    ProductsModule,
    CartModule,
    NoticesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
