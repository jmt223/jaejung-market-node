import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminJwtGuard } from '../auth/jwt.guard';
import { SuperAdminGuard } from '../common/guards/admin.guard';
import { imageUploadOptions, saveImage } from '../common/image-upload';
import { parsePaging } from '../common/paging';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

// 관리자용 상품 관리
@Controller('admin/products')
@UseGuards(AdminJwtGuard, SuperAdminGuard)
export class AdminProductsController {
  constructor(
    private productsService: ProductsService,
    private config: ConfigService,
  ) {}

  // 상품 목록
  @Get()
  list() {
    return this.productsService.findPage(parsePaging(1, 10));
  }

  // 상품 하나 조회 (수정 화면에서 씀)
  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOrThrow(id);
  }

  // 새 상품 등록
  @Post()
  @UseInterceptors(FileInterceptor('imageFile', imageUploadOptions))
  async create(@Body() dto: ProductDto, @UploadedFile() file?: Express.Multer.File) {
    let fileName: string | null = null;

    // 이미지 올렸으면 검사하고 저장 (통과 못하면 에러나서 등록 안됨)
    if (file) {
      fileName = saveImage(file, this.config.getOrThrow<string>('UPLOAD_DIR'));
    }

    await this.productsService.create(dto, fileName);
    return { ok: true };
  }

  // 상품 수정
  @Post(':id/edit')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('imageFile', imageUploadOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const existing = await this.productsService.getOrThrow(id);

    // 이미지 안올렸으면 기존 이미지 유지
    let fileName = existing.fileName;
    if (file) {
      fileName = saveImage(file, this.config.getOrThrow<string>('UPLOAD_DIR'));
    }

    await this.productsService.update(id, dto, fileName);
    return { ok: true };
  }

  // 상품 삭제
  @Post(':id/delete')
  @HttpCode(200)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
    return { ok: true };
  }
}
