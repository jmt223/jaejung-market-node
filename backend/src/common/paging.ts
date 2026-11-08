export interface Paging {
  pageSize: number;
  offset: number;
}

// [보안조치] 보고서 항목은 아닌데 pageNum=-1 이나 pageSize=99999999 넣으면 쿼리 에러나거나 전체가 조회됨
// 이상한 값 들어오면 기본값으로 바꿈
export function parsePaging(pageNum: unknown, pageSize: unknown): Paging {
  let page = Number(pageNum);
  let size = Number(pageSize);

  if (!Number.isInteger(page) || page < 1) {
    page = 1;
  }
  if (!Number.isInteger(size) || size < 1 || size > 100) {
    size = 10;
  }

  return { pageSize: size, offset: (page - 1) * size };
}

// 쿼리스트링 값이 문자열인지 확인하고 길이도 자름
export function toText(value: unknown, maxLength = 100): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.substring(0, maxLength);
}
