import { Body, ConflictException, Controller, Get, HttpCode, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { toText } from '../common/paging';
import { RegisterDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { OptionalUserGuard } from './jwt.guard';
import { TokenService } from './token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private usersService: UsersService,
  ) {}

  // 로그인 처리
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.loginUser(dto.username, dto.password);

    this.tokenService.issue(res, 'user', user.id, user.sessionId as string);
    return { id: user.id, username: user.username };
  }

  // 로그아웃
  // [보안조치] (3) 검증되지 않은 리다이렉트와 포워드
  // 이동할 주소를 파라미터로 안받음. 로그아웃하면 화면에서 /login 으로만 이동함
  @Post('logout')
  @HttpCode(200)
  @UseGuards(OptionalUserGuard)
  async logout(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    if (user) {
      await this.usersService.clearSession(user.id);
    }
    this.tokenService.clear(res, 'user');
    return { ok: true };
  }

  // 지금 로그인한 사람 정보 (화면 상단 메뉴에서 씀)
  @Get('me')
  @UseGuards(OptionalUserGuard)
  me(@CurrentUser() user: any) {
    if (!user) {
      return { user: null };
    }
    return { user: { id: user.id, username: user.username } };
  }

  // 회원가입 처리
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const exists = await this.usersService.findByUsername(dto.username);
    if (exists) {
      throw new ConflictException('이미 사용 중인 아이디입니다.');
    }

    await this.usersService.register(dto);
    return { ok: true };
  }

  // 아이디 중복 검사
  // [보안조치] (2) 삽입 (Injection) 공격 가능성
  // 입력값을 쿼리에 문자열로 안붙이고 typeorm where 조건으로 넘겨서 바인딩됨
  @Get('check-username')
  async checkUsername(@Query('username') username: unknown) {
    const user = await this.usersService.findByUsername(toText(username, 50));
    if (user) {
      return { available: false };
    }
    return { available: true };
  }
}
