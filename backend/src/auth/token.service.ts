import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

export const USER_COOKIE = 'user_token';
export const ADMIN_COOKIE = 'admin_token';

// 로그인하고 30분 지나면 다시 로그인해야됨
const THIRTY_MINUTES = 30 * 60 * 1000;

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // 토큰은 httpOnly 쿠키에 저장함
  // localStorage에 넣으면 XSS 터졌을때 토큰이 털리는데 httpOnly는 js로 못읽음
  private cookieOptions(): any {
    return {
      httpOnly: true,
      sameSite: 'strict',
      secure: this.config.get('COOKIE_SECURE') === 'true',
      path: '/',
    };
  }

  // 토큰 만들어서 쿠키에 넣기
  issue(res: Response, type: string, accountId: number, sessionId: string) {
    const token = this.jwtService.sign({ sub: accountId, sid: sessionId, typ: type });

    let cookieName = USER_COOKIE;
    if (type === 'admin') {
      cookieName = ADMIN_COOKIE;
    }

    const options = this.cookieOptions();
    options.maxAge = THIRTY_MINUTES;
    res.cookie(cookieName, token, options);
  }

  // 로그아웃할때 쿠키 지우기
  clear(res: Response, type: string) {
    let cookieName = USER_COOKIE;
    if (type === 'admin') {
      cookieName = ADMIN_COOKIE;
    }
    res.clearCookie(cookieName, this.cookieOptions());
  }
}
