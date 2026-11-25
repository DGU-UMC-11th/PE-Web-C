import {
  INestApplication,
  Provider,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter';

interface TestAppOptions {
  entities: Type[];
  controllers: Type[];
  providers: Provider[];
}

// 통합 테스트용 앱: 개발용 MySQL 대신 테스트가 도는 동안만 메모리에 생기는 SQLite(sql.js)를 씀
export async function createTestApp({
  entities,
  controllers,
  providers,
}: TestAppOptions): Promise<{
  app: INestApplication;
  moduleFixture: TestingModule;
}> {
  const moduleFixture = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqljs',
        autoSave: false,
        entities,
        synchronize: true, // 엔티티를 보고 테이블을 만들어 줌
      }),
      TypeOrmModule.forFeature(entities),
      JwtModule.register({
        global: true,
        secret: 'test-secret-for-e2e-only',
        signOptions: { expiresIn: 3600 },
      }),
    ],
    controllers,
    providers,
  }).compile();

  const app = moduleFixture.createNestApplication();

  // main.ts의 전역 설정은 테스트 앱에 자동으로 따라오지 않아서 다시 붙임
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.init();

  return { app, moduleFixture };
}

// 로그인 API를 거치지 않고, AuthGuard가 읽는 것과 같은 모양의 토큰을 직접 발급
export function bearerToken(
  moduleFixture: TestingModule,
  member: { memberId: number; email: string },
): string {
  const token = moduleFixture
    .get(JwtService)
    .sign({ sub: String(member.memberId), email: member.email });
  return `Bearer ${token}`;
}
