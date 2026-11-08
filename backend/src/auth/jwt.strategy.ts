import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminsService } from '../admins/admins.service';
import { UsersService } from '../users/users.service';
import { AuthUser, TokenPayload } from './auth.types';
import { ADMIN_COOKIE, USER_COOKIE } from './token.service';

// 쿠키에서 토큰 꺼내는 함수. 헤더가 아니라 쿠키에 넣어서 직접 만들어야됨
function userTokenFromCookie(req: Request) {
  return req.cookies[USER_COOKIE];
}

function adminTokenFromCookie(req: Request) {
  return req.cookies[ADMIN_COOKIE];
}

// 사용자 토큰 검사
@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(
    config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([userTokenFromCookie]),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
      algorithms: ['HS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: TokenPayload): Promise<AuthUser> {
    // 관리자 토큰으로 사용자 기능 못쓰게
    if (payload.typ !== 'user') {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    // 토큰이 멀쩡해도 DB session_id 랑 다르면 거부함
    // 다른데서 로그인했거나 로그아웃, 계정잠금 된 경우임 (중복 로그인 방지)
    if (user.accountLocked || user.sessionId !== payload.sid) {
      throw new UnauthorizedException();
    }

    return { id: user.id, username: user.username, sid: payload.sid };
  }
}

// 관리자 토큰 검사
@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(
    config: ConfigService,
    private adminsService: AdminsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([adminTokenFromCookie]),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
      algorithms: ['HS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: TokenPayload): Promise<AuthUser> {
    if (payload.typ !== 'admin') {
      throw new UnauthorizedException();
    }

    const admin = await this.adminsService.findById(payload.sub);
    if (!admin) {
      throw new UnauthorizedException();
    }

    if (admin.accountLocked || admin.sessionId !== payload.sid) {
      throw new UnauthorizedException();
    }

    return { id: admin.id, username: admin.username, role: admin.role, sid: payload.sid };
  }
}
