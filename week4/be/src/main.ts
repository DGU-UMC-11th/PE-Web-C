import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 필드는 제거
      forbidNonWhitelisted: true, // DTO에 없는 필드가 오면 400
      transform: true, // 요청 body를 DTO 인스턴스로 변환
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
