// src/books/entities/category.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id', type: 'bigint' })
  categoryId: number;

  @Column({ length: 50 })
  name: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
