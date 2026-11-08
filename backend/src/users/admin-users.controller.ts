import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtGuard } from '../auth/jwt.guard';
import { SuperAdminGuard } from '../common/guards/admin.guard';
import { maskId } from '../common/masking';
import { RegisterDto } from './dto/user.dto';
import { toUserView, UsersService } from './users.service';

// 관리자용 사용자 관리
@Controller('admin/users')
@UseGuards(AdminJwtGuard, SuperAdminGuard)
export class AdminUsersController {
  constructor(private usersService: UsersService) {}

  // 사용자 목록
  @Get()
  async list() {
    const users = await this.usersService.findAll();

    // [보안조치] (5) 계정 정보 파악 가능성 : 응답에 나가기 전에 아이디 마스킹
    const result: any[] = [];
    for (const user of users) {
      const view = toUserView(user);
      view.username = maskId(view.username);
      result.push(view);
    }
    return result;
  }

  // 사용자 상세
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }

    // [보안조치] (5) 계정 정보 파악 가능성 : 상세도 똑같이 마스킹
    const view = toUserView(user);
    view.username = maskId(view.username);
    return view;
  }

  // 새 사용자 생성
  @Post('new')
  async create(@Body() dto: RegisterDto) {
    const exists = await this.usersService.findByUsername(dto.username);
    if (exists) {
      throw new ConflictException('이미 사용 중인 아이디입니다.');
    }

    await this.usersService.register(dto);
    return { ok: true };
  }

  // [보안조치] (1) XSS / CSRF 공격 가능성
  // 스프링에서 GET이라 링크만 눌러도 실행됐던 기능들. 전부 POST로 만들고 토큰 검사함

  // 계정 잠금 해제
  @Post(':id/unlock')
  @HttpCode(200)
  async unlock(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.unlock(id);
    return { ok: true };
  }

  // 사용자 삭제
  @Post(':id/delete')
  @HttpCode(200)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return { ok: true };
  }
}
