// 날짜 보기좋게 바꾸기
export function formatDate(value?: string | null): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString("sv-SE", { timeZone: "Asia/Seoul" });
}

// 이미지 주소 만들기. 파일명에 한글 있을수 있어서 인코딩함
export function imageUrl(fileName: string): string {
  return `/images/${encodeURIComponent(fileName)}`;
}

// 폼에 입력한 값을 객체로 바꿔줌
export function formValues(form: HTMLFormElement): Record<string, string> {
  return Object.fromEntries(new FormData(form)) as Record<string, string>;
}
