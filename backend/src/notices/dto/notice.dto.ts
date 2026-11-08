import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

const REQUIRED = '제목과 내용을 입력해 주세요.';

export class NoticeDto {
  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(255, { message: '제목은 255자 이하로 입력해 주세요.' })
  title: string;

  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(20000, { message: '내용이 너무 깁니다.' })
  content: string;
}
