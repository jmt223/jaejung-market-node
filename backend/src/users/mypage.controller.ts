import { Body, Controller, Get, HttpCode, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserJwtGuard } from '../auth/jwt.guard';
import { UpdateMypageDto } from './dto/user.dto';
import { toUserView, UsersService } from './users.service';

@Controller('mypage')
@UseGuards(UserJwtGuard)
export class MypageController {
  constructor(private usersService: UsersService) {}

  // 마이페이지 보기
  @Get()
  async mypage(@CurrentUser() current: any) {
    const user = await this.usersService.findById(current.id);
    if (!user) {
      throw new NotFoundException();
    }
    return toUserView(user);
  }

  // 마이페이지 수정. id는 파라미터로 안받고 토큰에서 꺼냄 (남의 정보 수정 못하게)
  @Post('edit')
  @HttpCode(200)
  async edit(@CurrentUser() current: any, @Body() dto: UpdateMypageDto) {
    await this.usersService.updateMypage(current.id, dto);
    return { ok: true };
  }
}
