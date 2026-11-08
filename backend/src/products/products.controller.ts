import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserJwtGuard } from '../auth/jwt.guard';
import { ProductsService } from './products.service';

// 사용자용 상품 (로그인 해야 볼수 있음. 스프링이랑 똑같음)
// 상품 검색, 카테고리 필터는 메인(/api/main)에서 같이 함
@Controller('products')
@UseGuards(UserJwtGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // 상품 상세
  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOrThrow(id);
  }
}
