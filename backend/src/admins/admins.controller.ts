import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { LoginDto } from '../auth/dto/login.dto';
import { AdminJwtGuard, OptionalAdminGuard } from '../auth/jwt.guard';
import { TokenService } from '../auth/token.service';
import { SuperAdminGuard } from '../common/guards/admin.guard';
import { maskId } from '../common/masking';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/admin.dto';

// 관리자 로그인이랑 관리자 계정 관리
@Controller('admin')
export class AdminsController {
  constructor(
    private adminsService: AdminsService,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  // 관리자 로그인 처리 (5번 틀리면 잠김, 잠금 처리는 AuthService에 있음)
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const admin = await this.authService.loginAdmin(dto.username, dto.password);

    this.tokenService.issue(res, 'admin', admin.id, admin.sessionId as string);
    return { id: admin.id, username: admin.username, role: admin.role };
  }

  // 관리자 로그아웃
  @Post('logout')
  @HttpCode(200)
  @UseGuards(OptionalAdminGuard)
  async logout(@CurrentUser() admin: any, @Res({ passthrough: true }) res: Response) {
    if (admin) {
      await this.adminsService.clearSession(admin.id);
    }
    this.tokenService.clear(res, 'admin');
    return { ok: true };
  }

  // 지금 로그인한 관리자 정보 (대시보드에서 씀)
  @Get('me')
  @UseGuards(AdminJwtGuard)
  me(@CurrentUser() admin: any) {
    return { id: admin.id, username: admin.username, role: admin.role };
  }

  // 관리자 목록
  // [보안조치] (9) 일반 계정 권한 상승 가능성 : 아래부터는 전부 SuperAdminGuard 붙임
  @Get('management')
  @UseGuards(AdminJwtGuard, SuperAdminGuard)
  async management() {
    const admins = await this.adminsService.findAll();

    // [보안조치] (5) 계정 정보 파악 가능성 : 아이디 마스킹
    const result: any[] = [];
    for (const admin of admins) {
      result.push({
        id: admin.id,
        username: maskId(admin.username),
        accountLocked: admin.accountLocked,
      });
    }
    return result;
  }

  // 새 관리자 생성
  @Post('management/new')
  @UseGuards(AdminJwtGuard, SuperAdminGuard)
  async createManaged(@Body() dto: CreateAdminDto) {
    await this.adminsService.create(dto);
    return { ok: true };
  }

  // 관리자 계정 잠금 해제
  @Post('management/:id/unlock')
  @HttpCode(200)
  @UseGuards(AdminJwtGuard, SuperAdminGuard)
  async unlock(@Param('id', ParseIntPipe) id: number) {
    await this.adminsService.unlock(id);
    return { ok: true };
  }

  // 관리자 삭제
  @Post('management/:id/delete')
  @HttpCode(200)
  @UseGuards(AdminJwtGuard, SuperAdminGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.adminsService.remove(id);
    return { ok: true };
  }
}
