import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { BEARER_AUTH } from './swagger/api-response.decorator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 문서 표지와 자물쇠 버튼(Authorize)에 쓸 인증 방식
  const config = new DocumentBuilder()
    .setTitle('영화 평점 서비스 API')
    .setDescription(
      'UMC 11기 백엔드 워크북에서 만든 회원/평점/즐겨찾기 API 문서입니다.',
    )
    .setVersion('v1')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      BEARER_AUTH,
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // 문서 화면 http://localhost:3000/swagger-ui, JSON http://localhost:3000/swagger-ui-json
  SwaggerModule.setup('swagger-ui', app, document);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
