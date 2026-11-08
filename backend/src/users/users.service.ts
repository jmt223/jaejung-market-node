import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RegisterDto, UpdateMypageDto } from './dto/user.dto';
import { User } from './user.entity';

// 화면으로 보낼 값만 골라서 담음. 비밀번호, session_id는 안보냄
export function toUserView(user: User) {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    birthdate: user.birthdate,
    phoneNumber: user.phoneNumber,
    accountLocked: user.accountLocked,
  };
}

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  findById(id: number) {
    return this.userRepository.findOne({ where: { id: id } });
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username: username } });
  }

  // 사용자 전체 목록
  findAll() {
    return this.userRepository.find({ order: { id: 'ASC' } });
  }

  save(user: User) {
    return this.userRepository.save(user);
  }

  // 회원가입. 비밀번호는 BCrypt로 암호화해서 저장 (스프링이랑 같은 방식이라 기존 계정도 로그인됨)
  async register(dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    await this.userRepository.insert({
      username: dto.username,
      password: hash,
      name: dto.name,
      birthdate: dto.birthdate,
      phoneNumber: dto.phoneNumber,
      failedAttempts: 0,
      accountLocked: false,
      sessionId: null,
    });
  }

  // 회원정보 수정
  async updateMypage(id: number, dto: UpdateMypageDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException();
    }

    user.name = dto.name;
    user.birthdate = dto.birthdate;
    user.phoneNumber = dto.phoneNumber;

    // 비밀번호는 입력했을때만 변경
    if (dto.password && dto.password.trim() !== '') {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    await this.userRepository.save(user);
  }

  // 로그아웃하면 session_id 지움. 토큰이 남아있어도 못씀
  async clearSession(id: number) {
    await this.userRepository.update(id, { sessionId: null });
  }

  // 계정 잠금 해제
  async unlock(id: number) {
    await this.userRepository.update(id, { accountLocked: false, failedAttempts: 0, sessionId: null });
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }
}
