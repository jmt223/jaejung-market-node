import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// cart 테이블이랑 매핑
@Entity('cart')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'product_id', type: 'bigint' })
  productId: number;

  @Column({ type: 'int' })
  quantity: number;
}
