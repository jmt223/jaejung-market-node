import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// admins 테이블이랑 매핑
@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50, default: 'SUPER_ADMIN' })
  role: string;

  @Column({ name: 'failed_attempts', type: 'int', default: 0 })
  failedAttempts: number;

  @Column({ name: 'account_locked', type: 'boolean', default: false })
  accountLocked: boolean;

  @Column({ name: 'session_id', type: 'varchar', length: 255, nullable: true })
  sessionId: string | null;
}
