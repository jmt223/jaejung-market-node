import { IsDateString, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

const REQUIRED = '모든 필수 항목을 입력해야 합니다.';
const BIRTHDATE = '생년월일은 YYYY-MM-DD 형식으로 입력해 주세요.';
const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

export class RegisterDto {
  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(50, { message: '아이디는 50자 이하로 입력해 주세요.' })
  username: string;

  // BCrypt가 72바이트까지만 써서 그 이상은 안받음
  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(72, { message: '비밀번호는 72자 이하로 입력해 주세요.' })
  password: string;

  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(100, { message: '이름은 100자 이하로 입력해 주세요.' })
  name: string;

  @IsString({ message: REQUIRED })
  @Matches(DATE_FORMAT, { message: BIRTHDATE })
  // 2000-13-45 같이 없는 날짜도 막아야됨. 안막으면 DB에서 에러남
  @IsDateString({ strict: true }, { message: BIRTHDATE })
  birthdate: string;

  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(20, { message: '전화번호는 20자 이하로 입력해 주세요.' })
  phoneNumber: string;
}

export class UpdateMypageDto {
  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(100, { message: '이름은 100자 이하로 입력해 주세요.' })
  name: string;

  @IsString({ message: REQUIRED })
  @Matches(DATE_FORMAT, { message: BIRTHDATE })
  // 2000-13-45 같이 없는 날짜도 막아야됨. 안막으면 DB에서 에러남
  @IsDateString({ strict: true }, { message: BIRTHDATE })
  birthdate: string;

  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(20, { message: '전화번호는 20자 이하로 입력해 주세요.' })
  phoneNumber: string;

  // 비밀번호는 입력했을때만 변경
  @IsOptional()
  @IsString()
  @MaxLength(72, { message: '비밀번호는 72자 이하로 입력해 주세요.' })
  password?: string;
}
