import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { CSRF_COOKIE } from './common/csrf.middleware';
import { parsePaging, toText } from './common/paging';
import { NoticesService } from './notices/notices.service';
import { ProductsService } from './products/products.service';

@Controller()
export class AppController {
  constructor(
    private productsService: ProductsService,
    private noticesService: NoticesService,
    private config: ConfigService,
  ) {}

  // 화면에서 POST 하기 전에 호출해서 CSRF 토큰 쿠키를 받아감
  @Get('csrf')
  csrf(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    let token = req.cookies[CSRF_COOKIE];
    if (!token) {
      token = randomUUID();
      res.cookie(CSRF_COOKIE, token, {
        httpOnly: false, // js에서 읽어서 헤더로 보내야돼서 이것만 false
        sameSite: 'strict',
        secure: this.config.get('COOKIE_SECURE') === 'true',
        path: '/',
      });
    }
    return { csrfToken: token };
  }

  // 메인 페이지 (로그인 안해도 볼수 있음). 상품 검색, 카테고리 필터도 여기서 같이 함
  @Get('main')
  async main(@Query() query: any) {
    const keyword = toText(query.keyword);
    // 카테고리는 하나만 고름 (스프링이랑 똑같이 category 하나)
    const category = toText(query.category);
    const paging = parsePaging(query.pageNum, query.pageSize);

    const posts = await this.productsService.search(keyword, category, paging);

    // 공지사항은 5개만 보여줌
    const topNotices = await this.noticesService.findTop(5);

    return { posts: posts, topNotices: topNotices, keyword: keyword, category: category };
  }
}
