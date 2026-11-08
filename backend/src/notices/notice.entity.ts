import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// notice 테이블이랑 매핑
@Entity('notice')
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'created_at', type: 'timestamp', insert: false, update: false })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', insert: false, update: false })
  updatedAt: Date;

  @Column({ name: 'admin_id', type: 'bigint', nullable: true })
  adminId: number | null;
}
