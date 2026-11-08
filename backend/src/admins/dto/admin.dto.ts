import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

const REQUIRED = '아이디와 비밀번호는 필수 항목입니다.';

export class CreateAdminDto {
  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(50, { message: '아이디는 50자 이하로 입력해 주세요.' })
  username: string;

  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(72, { message: '비밀번호는 72자 이하로 입력해 주세요.' })
  password: string;

  @IsOptional()
  @IsIn(['SUPER_ADMIN', 'INQUIRY_ADMIN'], { message: '권한을 확인해 주세요.' })
  role?: string;
}
