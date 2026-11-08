import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

// [보안조치] (10) 일괄적인 오류 처리 페이지 존재 여부
// 에러 내용은 서버 콘솔에만 찍고 화면에는 정해진 문구만 보냄
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    // 우리가 일부러 던진 에러는 메시지 그대로 보냄
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body: any = exception.getResponse();

      let message = '잘못된 요청입니다.';
      if (typeof body === 'string') {
        message = body;
      } else if (typeof body.message === 'string') {
        message = body.message;
      }

      if (status === 404) {
        message = '요청하신 정보를 찾을 수 없습니다.';
      }
      if (status === 413) {
        message = '파일 크기가 너무 큽니다.';
      }

      res.status(status).json({ statusCode: status, message: message });
      return;
    }

    // 나머지는 DB 에러 같은거라 내용 안보여줌
    console.error(exception);
    res.status(500).json({ statusCode: 500, message: '요청을 처리하지 못했습니다.' });
  }
}
