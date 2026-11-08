import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// 상품 (테이블 이름이 post임)
@Entity('post')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'created_at', type: 'timestamp', insert: false, update: false })
  createdAt: Date;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'file_name', type: 'varchar', length: 255, nullable: true })
  fileName: string | null;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar', length: 100 })
  category: string;
}
