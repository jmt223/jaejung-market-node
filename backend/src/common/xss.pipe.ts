import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

// [보안조치] (1) XSS / CSRF 공격 가능성
// 보고서 표7 특수문자 치환 (스프링 XssFilterUtil 이랑 똑같이 맞춤)
// & 랑 # 은 치환결과에도 들어가는 글자라서 제일 먼저 바꿔야됨. 뒤에서 바꾸면 &lt; 가 &amp;lt; 로 또 바뀜
// / 는 뺐음. 카테고리에 "가방/지갑" 처럼 /가 들어가서 치환하면 값이 안맞음 (출력은 React가 문자열로만 찍음)
export function sanitize(input: string): string {
  let result = input;
  result = result.replaceAll('&', '&amp;');
  result = result.replaceAll('#', '&#35;');
  result = result.replaceAll('<', '&lt;');
  result = result.replaceAll('>', '&gt;');
  result = result.replaceAll('(', '&#40;');
  result = result.replaceAll(')', '&#41;');
  result = result.replaceAll("'", '&#39;');
  result = result.replaceAll('"', '&quot;');
  return result;
}

// 객체 안에 있는 문자열을 전부 치환함
// 비밀번호는 치환하면 안됨. 치환된 값으로 암호화되면 비번에 특수문자 넣은 사람이 로그인을 못함
// 어차피 화면에 출력도 안하고 BCrypt로 저장하니까 XSS 걱정 없음
function cleanValue(value: any, name: string): any {
  if (name === 'password') {
    return value;
  }

  if (typeof value === 'string') {
    return sanitize(value);
  }

  if (Array.isArray(value)) {
    const list: any[] = [];
    for (let i = 0; i < value.length; i++) {
      list.push(cleanValue(value[i], name));
    }
    return list;
  }

  if (value !== null && typeof value === 'object') {
    const result: any = {};
    for (const key of Object.keys(value)) {
      result[key] = cleanValue(value[key], key);
    }
    return result;
  }

  return value;
}

// 화면에서 보낸 값(body, 쿼리스트링)이 컨트롤러에 들어가기 전에 치환함
// 미들웨어로 하면 이미지 올리는 폼(multipart)은 아직 안읽은 상태라서 pipe로 만듬
@Injectable()
export class XssPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body' && metadata.type !== 'query') {
      return value;
    }

    let name = '';
    if (metadata.data) {
      name = metadata.data;
    }
    return cleanValue(value, name);
  }
}
