// src/books/books.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BookResponseDto } from './dto/book-response.dto';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // GET /books
  @Get()
  async getBooks(): Promise<BookResponseDto[]> {
    return await this.booksService.getBooks();
  }

  // GET /books/category/:categoryId
  @Get('category/:categoryId')
  async getBooksByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<BookResponseDto[]> {
    return await this.booksService.getBooksByCategory(categoryId);
  }

  // POST /books
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBook(@Body() dto: CreateBookDto): Promise<BookResponseDto> {
    return await this.booksService.createBook(dto);
  }
}
