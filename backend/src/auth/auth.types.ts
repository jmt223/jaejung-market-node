// 토큰 안에 들어가는 값
export interface TokenPayload {
  sub: number; // 사용자 id
  sid: string; // 세션 id (DB session_id 랑 비교함)
  typ: string; // user 또는 admin
}

// 로그인한 사람 정보 (req.user 에 들어감)
export interface AuthUser {
  id: number;
  username: string;
  role?: string;
  sid: string;
}
