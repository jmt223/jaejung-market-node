import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes, randomUUID } from 'crypto';
import { Admin } from '../admins/admin.entity';
import { AdminsService } from '../admins/admins.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

// 로그인 5번 틀리면 잠금
const MAX_FAIL_COUNT = 5;

@Injectable()
export class AuthService {
  // 없는 아이디여도 비밀번호 비교하는 시간을 똑같이 쓰려고 만든 가짜 해시
  private dummyHash = bcrypt.hashSync(randomBytes(16).toString('hex'), 10);

  constructor(
    private usersService: UsersService,
    private adminsService: AdminsService,
  ) {}

  // 사용자 로그인
  async loginUser(username: string, password: string): Promise<User> {
    // [보안조치] (10) 일괄적인 오류 처리 페이지 존재 여부
    // 전에는 아이디 없을때랑 비번 틀렸을때 메시지가 달라서 아이디 있는지 알수 있었음. 하나로 통일
    const failMessage = '아이디 또는 비밀번호가 잘못되었습니다.';

    // 아이디로 찾기
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      await bcrypt.compare(password, this.dummyHash);
      throw new UnauthorizedException(failMessage);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // 잠긴 계정인지 확인
    if (user.accountLocked) {
      // [보안조치] (10) 비번이 틀려도 잠겼다고 알려주면 아이디가 있다는걸 알게 됨
      // 비번까지 맞은 경우에만 잠겼다고 알려줌
      if (isMatch) {
        throw new UnauthorizedException('계정이 잠겼습니다. 관리자에게 문의하세요.');
      }
      throw new UnauthorizedException(failMessage);
    }

    // 비번 틀렸으면 실패 횟수 +1
    if (!isMatch) {
      user.failedAttempts = user.failedAttempts + 1;
      if (user.failedAttempts >= MAX_FAIL_COUNT) {
        user.accountLocked = true;
      }
      await this.usersService.save(user);
      throw new UnauthorizedException(failMessage);
    }

    // 로그인 성공. session_id를 새로 넣으면 전에 로그인한 곳은 끊김 (중복 로그인 방지)
    user.failedAttempts = 0;
    user.sessionId = randomUUID();
    await this.usersService.save(user);
    return user;
  }

  // 관리자 로그인 (사용자랑 거의 똑같음)
  // TODO 나중에 시간되면 하나로 합치기
  async loginAdmin(username: string, password: string): Promise<Admin> {
    // [보안조치] (10) 아이디가 없든 비번이 틀리든 메시지 똑같이 출력
    const failMessage = '유효하지 않은 관리자 계정입니다.';

    const admin = await this.adminsService.findByUsername(username);
    if (!admin) {
      await bcrypt.compare(password, this.dummyHash);
      throw new UnauthorizedException(failMessage);
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (admin.accountLocked) {
      if (isMatch) {
        throw new UnauthorizedException('계정이 잠겼습니다. 관리자에게 문의하세요.');
      }
      throw new UnauthorizedException(failMessage);
    }

    if (!isMatch) {
      admin.failedAttempts = admin.failedAttempts + 1;
      if (admin.failedAttempts >= MAX_FAIL_COUNT) {
        admin.accountLocked = true;
      }
      await this.adminsService.save(admin);
      throw new UnauthorizedException(failMessage);
    }

    admin.failedAttempts = 0;
    admin.sessionId = randomUUID();
    await this.adminsService.save(admin);
    return admin;
  }
}
