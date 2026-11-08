// [보안조치] (5) 계정 정보 파악 가능성
// 사내 마스킹 기준 : ID 끝 2자리 가리기 (asd12 -> asd**)
export function maskId(id: string): string {
  // 2글자 이하면 그냥 전부 별표
  if (id.length <= 2) {
    let stars = '';
    for (let i = 0; i < id.length; i++) {
      stars = stars + '*';
    }
    return stars;
  }

  return id.substring(0, id.length - 2) + '**';
}
