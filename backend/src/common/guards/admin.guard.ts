import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

// [보안조치] (9) 일반 계정 권한 상승 가능성
// 문의 기능은 없앴는데 DB에 문의 답변 관리자 계정이 남아있을수 있음
// 그 계정은 관리자 기능을 못쓰게 컨트롤러에 이 guard를 붙여서 막음
@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const admin = req.user;

    if (!admin || admin.role === 'INQUIRY_ADMIN') {
      throw new ForbiddenException('권한이 없습니다.');
    }
    return true;
  }
}
