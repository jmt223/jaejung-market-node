import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserJwtGuard } from '../auth/jwt.guard';
import { CartService } from './cart.service';
import { AddCartDto, UpdateCartDto } from './dto/cart.dto';

@Controller('cart')
@UseGuards(UserJwtGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  // 장바구니 보기
  @Get()
  list(@CurrentUser() user: any) {
    return this.cartService.list(user.id);
  }

  // 장바구니에 상품 담기
  @Post('add')
  async add(@CurrentUser() user: any, @Body() dto: AddCartDto) {
    await this.cartService.add(user.id, dto.productId, dto.quantity);
    return { ok: true };
  }

  // 수량 변경
  @Post('update')
  @HttpCode(200)
  async update(@CurrentUser() user: any, @Body() dto: UpdateCartDto) {
    await this.cartService.updateQuantity(dto.cartId, user.id, dto.quantity);
    return { ok: true };
  }

  // 장바구니 상품 삭제
  // [보안조치] (1) XSS / CSRF 공격 가능성 : 스프링에서 GET이었던거 POST로 만듬
  @Post('remove/:cartId')
  @HttpCode(200)
  async remove(@CurrentUser() user: any, @Param('cartId', ParseIntPipe) cartId: number) {
    await this.cartService.remove(cartId, user.id);
    return { ok: true };
  }
}
