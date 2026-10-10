// src/rental.service.ts
import { Injectable } from '@nestjs/common';
import { RentalRepository } from './rental.repository';

@Injectable()
export class RentalService {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async createRental(body: Record<string, any>): Promise<string> {
    await this.rentalRepository.create(body);
    return '도서 대여가 완료되었습니다!';
  }

  async returnRental(rentalId: number): Promise<string> {
    await this.rentalRepository.returnRental(rentalId);
    return '도서 반납이 완료되었습니다!';
  }
}
