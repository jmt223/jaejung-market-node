import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminsModule } from '../admins/admins.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminJwtStrategy, UserJwtStrategy } from './jwt.strategy';
import { TokenService } from './token.service';

// guard를 여기저기서 써서 Global로 해둠
@Global()
@Module({
  imports: [
    PassportModule,
    UsersModule,
    AdminsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.getOrThrow<string>('JWT_SECRET');
        // 키가 너무 짧으면 서버 안뜨게 함
        if (secret.length < 32) {
          throw new Error('JWT_SECRET은 32자 이상이어야 합니다.');
        }
        return { secret: secret, signOptions: { algorithm: 'HS256', expiresIn: '30m' } };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, UserJwtStrategy, AdminJwtStrategy],
  exports: [AuthService, TokenService, AdminsModule],
})
export class AuthModule {}
