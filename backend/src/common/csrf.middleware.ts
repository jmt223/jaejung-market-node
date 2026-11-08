import { Request, Response, NextFunction } from 'express';

export const CSRF_COOKIE = 'csrf_token';

// [보안조치] (1) XSS / CSRF 공격 가능성
// 로그인한 사람이 이상한 사이트 들어갔을때 몰래 요청 날아가는걸 막음
// 쿠키에 있는 토큰이랑 헤더로 온 토큰이 같아야 통과됨
// 다른 사이트에서는 우리 쿠키를 못읽으니까 헤더를 못만듬
export function csrfMiddleware(req: Request, res: Response, next: NextFunction) {
  // 조회는 검사 안함
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    next();
    return;
  }

  const cookieToken = req.cookies[CSRF_COOKIE];
  const headerToken = req.get('x-csrf-token');

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ statusCode: 403, message: '잘못된 요청입니다.' });
    return;
  }

  next();
}
