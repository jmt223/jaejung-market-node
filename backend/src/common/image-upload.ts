import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { memoryStorage } from 'multer';
import { extname, join, resolve } from 'path';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// 일단 메모리에 받아놓고 검사 끝나면 파일로 저장함
export const imageUploadOptions = {
  storage: memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
};

// 파일 맨 앞 몇 바이트(매직넘버)를 보고 진짜 이미지인지 확인
// jpg = FF D8 FF / png = 89 50 4E 47 / gif = 47 49 46 38
function isRealImage(buffer: Buffer, ext: string): boolean {
  if (ext === 'jpg' || ext === 'jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (ext === 'png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }
  if (ext === 'gif') {
    return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38;
  }
  return false;
}

// 확장자에 맞는 MIME 타입 구하기
function getMimeType(ext: string): string {
  if (ext === 'jpg' || ext === 'jpeg') {
    return 'image/jpeg';
  }
  if (ext === 'png') {
    return 'image/png';
  }
  if (ext === 'gif') {
    return 'image/gif';
  }
  return '';
}

// [보안조치] (4) 악성코드파일 업로드 가능성
// 서버에서 전부 검사하고 통과한 파일만 저장함. 저장된 파일명을 리턴
export function saveImage(file: Express.Multer.File, uploadDir: string): string {
  // 1. 확장자 검사 (화이트리스트)
  const ext = extname(file.originalname).replace('.', '').toLowerCase();
  const allowedExt = ['jpg', 'jpeg', 'png', 'gif'];
  if (!allowedExt.includes(ext)) {
    throw new BadRequestException('jpg, jpeg, png, gif 파일만 업로드할 수 있습니다.');
  }

  // 2. MIME 타입 검사 (이건 조작할수 있어서 이것만으론 안됨)
  if (file.mimetype !== getMimeType(ext)) {
    throw new BadRequestException('jpg, jpeg, png, gif 파일만 업로드할 수 있습니다.');
  }

  // 3. 파일 크기 검사
  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestException('파일 크기가 너무 큽니다.');
  }

  // 4. 파일 내용이 진짜 이미지인지 검사 (확장자만 jpg로 바꾼 파일 거르기)
  if (!isRealImage(file.buffer, ext)) {
    throw new BadRequestException('이미지 파일이 아닙니다.');
  }

  const dir = resolve(uploadDir);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // 5. 파일명은 랜덤으로 새로 만듬. 원본 파일명은 안씀 (../ 같은거 넣어도 소용없음)
  const saveName = randomUUID() + '.' + ext;
  // console.log('저장 파일명 : ' + saveName);

  // 6. 실행권한 없이 저장 (보고서에 실행 권한 주지 말라고 되어있음)
  writeFileSync(join(dir, saveName), file.buffer, { mode: 0o640 });

  return saveName;
}
