import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

const REQUIRED = '상품명, 가격, 재고, 카테고리는 필수 입력입니다.';
const MAX_INT = 2147483647;

// 이미지 때문에 multipart로 보내서 숫자도 문자열로 들어옴. @Type 붙여야 숫자로 바뀜
export class ProductDto {
  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(255, { message: '상품명은 255자 이하로 입력해 주세요.' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000, { message: '내용이 너무 깁니다.' })
  @Transform(({ value }) => value ?? '')
  content?: string;

  @Type(() => Number)
  @IsInt({ message: REQUIRED })
  @Min(0, { message: '가격은 0 이상이어야 합니다.' })
  @Max(MAX_INT, { message: '가격이 너무 큽니다.' })
  price: number;

  @Type(() => Number)
  @IsInt({ message: REQUIRED })
  @Min(0, { message: '재고는 0 이상이어야 합니다.' })
  @Max(MAX_INT, { message: '재고가 너무 큽니다.' })
  stock: number;

  @IsString({ message: REQUIRED })
  @IsNotEmpty({ message: REQUIRED })
  @MaxLength(100, { message: REQUIRED })
  category: string;
}
