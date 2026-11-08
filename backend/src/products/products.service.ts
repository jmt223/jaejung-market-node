import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paging } from '../common/paging';
import { ProductDto } from './dto/product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) {}

  // 상품 검색
  // [보안조치] (2) 삽입 (Injection) 공격 가능성
  // 검색어를 쿼리에 문자열로 붙이면 SQL Injection 됨. :keyword 처럼 파라미터로 넘겨서 바인딩함
  search(keyword: string, category: string, paging: Paging) {
    const query = this.productRepository.createQueryBuilder('p');
    query.orderBy('p.id', 'DESC');
    query.limit(paging.pageSize);
    query.offset(paging.offset);

    if (keyword !== '') {
      query.andWhere('(p.title LIKE :keyword OR p.content LIKE :keyword)', { keyword: '%' + keyword + '%' });
    }

    if (category !== '') {
      query.andWhere('p.category = :category', { category: category });
    }

    return query.getMany();
  }

  // 상품 목록
  findPage(paging: Paging) {
    return this.search('', '', paging);
  }

  findById(id: number) {
    return this.productRepository.findOne({ where: { id: id } });
  }

  // 상품 없으면 404
  async getOrThrow(id: number) {
    const product = await this.findById(id);
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }
    return product;
  }

  // 상품 등록
  async create(dto: ProductDto, fileName: string | null) {
    await this.productRepository.insert({
      title: dto.title,
      content: dto.content || '',
      price: dto.price,
      stock: dto.stock,
      category: dto.category,
      fileName: fileName,
      userId: 1, // 스프링이랑 똑같이 관리자가 등록한 상품은 1번으로 저장
    });
  }

  // 상품 수정
  async update(id: number, dto: ProductDto, fileName: string | null) {
    await this.productRepository.update(id, {
      title: dto.title,
      content: dto.content || '',
      price: dto.price,
      stock: dto.stock,
      category: dto.category,
      fileName: fileName,
    });
  }

  // 상품 삭제
  async remove(id: number) {
    await this.productRepository.delete(id);
  }
}
