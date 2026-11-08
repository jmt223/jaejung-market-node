import { Request, Response, NextFunction } from 'express';

// [보안조치] (6) 관리자 페이지 분리 여부
// 관리자 페이지가 일반 사용자랑 같은 도메인이라서 IP로 접근 제한함
// 허용 IP는 .env 의 ADMIN_ALLOWED_IPS 에 적으면 됨
export function adminIpMiddleware(allowedIps: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.ip 는 main.ts 의 trust proxy 설정을 거친 값이라 헤더로 조작이 안됨
    let ip = req.ip || '';
    // ipv4가 ::ffff:127.0.0.1 이렇게 들어올때가 있어서 앞부분 지움
    ip = ip.replace('::ffff:', '');
    // console.log('관리자 페이지 접속 IP : ' + ip);

    if (!allowedIps.includes(ip)) {
      // 403을 주면 관리자 페이지가 있다는게 티나니까 그냥 없는 페이지처럼 404로 보냄
      res.status(404).json({ statusCode: 404, message: 'Not Found' });
      return;
    }

    next();
  };
}
