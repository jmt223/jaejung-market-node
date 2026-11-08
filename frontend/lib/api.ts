// api 에러나면 상태코드도 같이 쓰려고 만듬
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// 쿠키에서 값 꺼내기
function readCookie(name: string): string {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].startsWith(name + "=")) {
      return decodeURIComponent(cookies[i].substring(name.length + 1));
    }
  }
  return "";
}

// [보안조치] (1) XSS / CSRF 공격 가능성
// 쿠키에 토큰 없으면 먼저 받아오고 POST 할때마다 헤더에 넣어서 보냄
async function getCsrfToken(): Promise<string> {
  const token = readCookie("csrf_token");
  if (token) {
    return token;
  }
  const response = await fetch("/api/csrf", { credentials: "same-origin" });
  const data = await response.json();
  return data.csrfToken;
}

// 응답을 json으로 바꾸고 에러면 throw
async function parse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? "요청을 처리하지 못했습니다.");
  }
  return data as T;
}

// GET 요청
export async function apiGet<T>(url: string): Promise<T> {
  return parse<T>(await fetch(url, { credentials: "same-origin" }));
}

// POST 요청. 이미지 올릴때는 FormData로 보내서 Content-Type 안넣음
export async function apiPost<T = unknown>(url: string, body?: unknown): Promise<T> {
  const isForm = body instanceof FormData;
  const headers: Record<string, string> = { "X-CSRF-Token": await getCsrfToken() };
  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers,
    body: isForm ? body : JSON.stringify(body ?? {}),
  });
  return parse<T>(response);
}
