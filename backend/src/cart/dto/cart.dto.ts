import { IsInt, Max, Min } from 'class-validator';

const QUANTITY = '수량을 확인해 주세요.';

// [보안조치] 보고서 항목은 아닌데 수량에 -1 넣으면 합계금액이 마이너스가 돼서 1 이상만 받음
export class AddCartDto {
  @IsInt({ message: QUANTITY })
  productId: number;

  @IsInt({ message: QUANTITY })
  @Min(1, { message: QUANTITY })
  @Max(100000, { message: QUANTITY })
  quantity: number;
}

export class UpdateCartDto {
  @IsInt({ message: QUANTITY })
  cartId: number;

  @IsInt({ message: QUANTITY })
  @Min(1, { message: QUANTITY })
  @Max(100000, { message: QUANTITY })
  quantity: number;
}
