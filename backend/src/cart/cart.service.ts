import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { CartItem } from './cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem) private cartRepository: Repository<CartItem>,
    private productsService: ProductsService,
  ) {}

  // 장바구니에 담기
  async add(userId: number, productId: number, quantity: number) {
    const product = await this.productsService.findById(productId);
    if (!product || product.stock < quantity) {
      throw new BadRequestException('재고가 부족합니다.');
    }

    await this.cartRepository.insert({ userId: userId, productId: productId, quantity: quantity });
  }

  // 장바구니 목록
  async list(userId: number) {
    const items = await this.cartRepository.find({ where: { userId: userId }, order: { id: 'ASC' } });

    const result: any[] = [];
    for (const item of items) {
      // 상품명, 가격은 cart 테이블에 없어서 상품에서 가져옴
      const product = await this.productsService.findById(item.productId);

      if (product) {
        result.push({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          productTitle: product.title,
          price: product.price,
          fileName: product.fileName,
        });
      } else {
        // 상품이 삭제됐을수도 있어서 넣어둠
        result.push({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          productTitle: '삭제된 상품',
          price: 0,
          fileName: null,
        });
      }
    }
    return result;
  }

  // 수량 변경
  // [보안조치] 보고서 항목은 아닌데 스프링에서 cartId만 바꾸면 남의 장바구니가 수정됐었음
  // 조건에 userId를 같이 넣어서 본인것만 수정되게 함
  async updateQuantity(cartId: number, userId: number, quantity: number) {
    await this.cartRepository.update({ id: cartId, userId: userId }, { quantity: quantity });
  }

  // 장바구니 삭제. 여기도 본인것만
  async remove(cartId: number, userId: number) {
    await this.cartRepository.delete({ id: cartId, userId: userId });
  }
}
