// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from './database.provider';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { RentalRepository } from './rental.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get('DB_PORT', 3306)),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'study'),
        charset: 'utf8mb4',
        autoLoadEntities: true,
        synchronize: false, // 이미 만든 테이블을 쓰므로 자동 스키마 변경은 끔
        bigNumberStrings: false, // BIGINT PK를 문자열이 아닌 숫자로 받음
        logging: ['query'], // 실행되는 SQL 확인용
      }),
    }),
    BooksModule,
  ],
  // rental API는 이번 주차 범위가 아니라 3주차 Raw SQL 방식 그대로 둠
  controllers: [AppController, RentalController],
  providers: [
    ...databaseProviders,
    AppService,
    RentalService,
    RentalRepository,
  ],
  exports: [...databaseProviders],
})
export class AppModule {}
