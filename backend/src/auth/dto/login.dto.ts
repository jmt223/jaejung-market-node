import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

const REQUIRED = '아이디와 비밀번호를 입력해 주세요.';

export class LoginDto {
  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(255, { message: REQUIRED })
  username: string;

  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(255, { message: REQUIRED })
  password: string;
}
