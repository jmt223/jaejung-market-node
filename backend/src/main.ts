import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { resolve } from 'path';
import { AppModule } from './app.module';
import { adminIpMiddleware } from './common/admin-ip.middleware';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { csrfMiddleware } from './common/csrf.middleware';
import { splitCsv } from './common/csv';
import { XssPipe } from './common/xss.pipe';

// 서버 시작하는 곳
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  // [보안조치] (11) 서버 헤더 정보 노출 : X-Powered-By 헤더 끔
  app.disable('x-powered-by');
  app.use(helmet());

  app.set('trust proxy', 'loopback');

  app.use(cookieParser());

  // [보안조치] (6) 관리자 페이지 분리 여부 : /api/admin 으로 오는건 전부 IP 체크
  app.use('/api/admin', adminIpMiddleware(splitCsv(config.get('ADMIN_ALLOWED_IPS'))));

  // [보안조치] (1) XSS / CSRF 공격 가능성 : POST 요청은 전부 토큰 체크
  app.use(csrfMiddleware);

  // 입력값 검사. dto에 없는 값은 알아서 버려줌
  // [보안조치] (1) XssPipe 가 먼저 돌아서 특수문자 치환한 다음에 검사함
  app.useGlobalPipes(
    new XssPipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        // 에러 메시지 첫번째꺼 하나만 보여줌
        let message = '입력값을 확인해 주세요.';
        if (errors.length > 0 && errors[0].constraints) {
          const constraints = errors[0].constraints;
          // 값이 아예 없으면 필수 입력 문구부터 보여줌
          if (constraints.isNotEmpty) {
            message = constraints.isNotEmpty;
          } else {
            message = Object.values(constraints)[0];
          }
        }
        return new BadRequestException(message);
      },
    }),
  );

  // [보안조치] (10) 일괄적인 오류 처리 : 에러 내용이 화면에 안나가게 함
  app.useGlobalFilters(new AllExceptionsFilter());

  // 모든 api 주소 앞에 /api 붙음
  app.setGlobalPrefix('api');

  // [보안조치] (4) 악성코드파일 업로드 : 업로드 폴더는 이미지 파일로만 내려주고 실행은 안됨
  const uploadDir = config.getOrThrow<string>('UPLOAD_DIR');
  app.useStaticAssets(resolve(uploadDir), { prefix: '/images/', index: false, dotfiles: 'deny' });

  // 백엔드는 같은 서버의 프론트만 부르니까 127.0.0.1 로만 엶 (방화벽도 3000만 열려있음)
  const port = Number(config.get('PORT') || 4000);
  await app.listen(port, '127.0.0.1');
  console.log('백엔드 서버 시작 : 127.0.0.1:' + port);
}

bootstrap();
