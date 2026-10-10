// src/books/books.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookResponseDto } from './dto/book-response.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './entities/book.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getBooks(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      relations: { category: true },
      order: { bookId: 'DESC' },
    });
    return books.map((book) => BookResponseDto.from(book));
  }

  async getBooksByCategory(categoryId: number): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      where: { category: { categoryId } },
      relations: { category: true },
      order: { bookId: 'DESC' },
    });
    return books.map((book) => BookResponseDto.from(book));
  }

  async createBook(dto: CreateBookDto): Promise<BookResponseDto> {
    const category = await this.categoryRepository.findOneBy({
      categoryId: dto.categoryId,
    });
    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }

    const book = this.bookRepository.create({
      category,
      title: dto.title,
      description: dto.description ?? null,
      isAvailable: true,
    });
    return BookResponseDto.from(await this.bookRepository.save(book));
  }
}
