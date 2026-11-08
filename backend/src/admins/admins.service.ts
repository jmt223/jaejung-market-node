import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { CreateAdminDto } from './dto/admin.dto';

@Injectable()
export class AdminsService {
  constructor(@InjectRepository(Admin) private adminRepository: Repository<Admin>) {}

  findById(id: number) {
    return this.adminRepository.findOne({ where: { id: id } });
  }

  findByUsername(username: string) {
    return this.adminRepository.findOne({ where: { username: username } });
  }

  // 관리자 목록
  findAll() {
    return this.adminRepository.find({ order: { id: 'ASC' } });
  }

  save(admin: Admin) {
    return this.adminRepository.save(admin);
  }

  // 관리자 등록
  async create(dto: CreateAdminDto) {
    const exists = await this.findByUsername(dto.username);
    if (exists) {
      throw new ConflictException('이미 사용 중인 아이디입니다.');
    }

    // 권한 안골랐으면 기본 권한 넣기
    let role = 'SUPER_ADMIN';
    if (dto.role) {
      role = dto.role;
    }

    const hash = await bcrypt.hash(dto.password, 10);

    await this.adminRepository.insert({
      username: dto.username,
      password: hash,
      role: role,
      failedAttempts: 0,
      accountLocked: false,
      sessionId: null,
    });
  }

  async clearSession(id: number) {
    await this.adminRepository.update(id, { sessionId: null });
  }

  // 계정 잠금 해제
  async unlock(id: number) {
    await this.adminRepository.update(id, { accountLocked: false, failedAttempts: 0, sessionId: null });
  }

  // 관리자 삭제
  async remove(id: number) {
    try {
      await this.adminRepository.delete(id);
    } catch (error) {
      // 공지사항 작성자로 잡혀있으면 DB에서 삭제가 막힘
      console.error(error);
      throw new ConflictException('작성한 공지사항이 있는 관리자는 삭제할 수 없습니다.');
    }
  }
}
