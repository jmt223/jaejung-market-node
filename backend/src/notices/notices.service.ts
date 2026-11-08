import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoticeDto } from './dto/notice.dto';
import { Notice } from './notice.entity';

@Injectable()
export class NoticesService {
  constructor(@InjectRepository(Notice) private noticeRepository: Repository<Notice>) {}

  // 공지 전체 목록 (최신순)
  findAll() {
    return this.noticeRepository.find({ order: { id: 'DESC' } });
  }

  // 메인에 나오는 공지. 로그인 안해도 보이니까 제목만 보냄
  findTop(limit: number) {
    return this.noticeRepository.find({ select: { id: true, title: true }, order: { id: 'DESC' }, take: limit });
  }

  async getOrThrow(id: number) {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException();
    }
    return notice;
  }

  async create(dto: NoticeDto, adminId: number) {
    await this.noticeRepository.insert({ title: dto.title, content: dto.content, adminId: adminId });
  }

  async update(id: number, dto: NoticeDto) {
    await this.noticeRepository.update(id, { title: dto.title, content: dto.content });
  }

  async remove(id: number) {
    await this.noticeRepository.delete(id);
  }
}
