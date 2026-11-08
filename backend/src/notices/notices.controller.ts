import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { AdminJwtGuard, UserJwtGuard } from '../auth/jwt.guard';
import { SuperAdminGuard } from '../common/guards/admin.guard';
import { NoticeDto } from './dto/notice.dto';
import { NoticesService } from './notices.service';

// [보안조치] (1) XSS / CSRF 공격 가능성 : Stored XSS 나왔던 곳
// 입력값은 XssPipe에서 특수문자 치환해서 저장하고, 화면(React)에서도 문자열로만 출력해서 스크립트가 실행 안됨

// 사용자용 공지사항
@Controller('notices')
@UseGuards(UserJwtGuard)
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @Get()
  list() {
    return this.noticesService.findAll();
  }

  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.noticesService.getOrThrow(id);
  }
}

// 관리자용 공지사항
@Controller('admin/notices')
@UseGuards(AdminJwtGuard, SuperAdminGuard)
export class AdminNoticesController {
  constructor(private noticesService: NoticesService) {}

  @Get()
  list() {
    return this.noticesService.findAll();
  }

  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.noticesService.getOrThrow(id);
  }

  @Post()
  async create(@CurrentUser() admin: any, @Body() dto: NoticeDto) {
    await this.noticesService.create(dto, admin.id);
    return { ok: true };
  }

  @Post(':id/edit')
  @HttpCode(200)
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: NoticeDto) {
    await this.noticesService.update(id, dto);
    return { ok: true };
  }

  // 공지 삭제
  // [보안조치] (1) XSS / CSRF 공격 가능성 : 스프링에서 GET이었던거 POST로 만듬
  @Post(':id/delete')
  @HttpCode(200)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.noticesService.remove(id);
    return { ok: true };
  }
}
