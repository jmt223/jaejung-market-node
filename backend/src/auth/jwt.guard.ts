import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// [보안조치] (8) 비인증 상태로 중요 page 접근 가능성
// 로그인 해야되는 api는 전부 이 guard를 붙임
// 화면에서 막는게 아니라 서버에서 막는거라 URL 직접 쳐도 안됨

// 사용자 로그인 체크
@Injectable()
export class UserJwtGuard extends AuthGuard('jwt-user') {}

// 관리자 로그인 체크
@Injectable()
export class AdminJwtGuard extends AuthGuard('jwt-admin') {}

// 로그인 안해도 통과되는 guard. 로그인 되어있으면 req.user가 들어있음 (상단 메뉴, 로그아웃에서 씀)
@Injectable()
export class OptionalUserGuard extends AuthGuard('jwt-user') {
  handleRequest(err: any, user: any) {
    if (user) {
      return user;
    }
    return null;
  }
}

@Injectable()
export class OptionalAdminGuard extends AuthGuard('jwt-admin') {
  handleRequest(err: any, user: any) {
    if (user) {
      return user;
    }
    return null;
  }
}

// [보안조치] (8) 비인증 상태로 중요 page 접근 가능성
// 로그인 없이 관리자 계정을 만들수 있었음 (/admin/create)
// 관리자 0명일때만 열어주는 식으로도 해봤는데 관리자를 다 지우면 다시 열려서 기능 자체를 없앰
// 첫 관리자는 DB에 직접 INSERT 함 (비번은 BCrypt 해시로 넣어야 로그인됨)
