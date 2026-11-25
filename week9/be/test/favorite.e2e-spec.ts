import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { FavoriteController } from '../src/controller/favorite.controller';
import { Favorite } from '../src/entity/favorite.entity';
import { Member } from '../src/entity/member.entity';
import { FavoriteService } from '../src/service/favorite.service';
import { bearerToken, createTestApp } from './create-test-app';

describe('즐겨찾기 API (통합 테스트)', () => {
  let app: INestApplication;
  let favoriteRepository: Repository<Favorite>;
  let member: Member;
  let authorization: string;

  beforeAll(async () => {
    const testApp = await createTestApp({
      entities: [Member, Favorite],
      controllers: [FavoriteController],
      providers: [FavoriteService],
    });
    app = testApp.app;

    const memberRepository = testApp.moduleFixture.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
    favoriteRepository = testApp.moduleFixture.get(
      getRepositoryToken(Favorite),
    );

    // 로그인한 회원이 있어야 하므로 회원을 저장하고 토큰을 직접 발급
    member = await memberRepository.save(
      memberRepository.create({
        email: 'challenger@umc.com',
        password: '$2b$10$abcdefghijklmnopqrstuv', // 로그인 API를 거치지 않아서 아무 값이나 괜찮음
        nickname: '영화조아',
      }),
    );
    authorization = bearerToken(testApp.moduleFixture, member);
  });

  beforeEach(async () => {
    // 앞 테스트가 남긴 즐겨찾기를 지워서 테스트끼리 영향을 주지 않게 함
    await favoriteRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('토큰 없이 즐겨찾기를 등록하면 401과 AUTH401_2를 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/favorites')
      .send({ movieId: 550 })
      .expect(401);

    expect(response.body.isSuccess).toBe(false);
    expect(response.body.code).toBe('AUTH401_2');
  });

  it('토큰을 담아 즐겨찾기를 등록하면 201과 저장된 영화 ID를 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', authorization)
      .send({ movieId: 550 })
      .expect(201);

    expect(response.body.code).toBe('COMMON201');
    expect(response.body.result.movieId).toBe(550);
  });

  it('이미 즐겨찾기한 영화를 다시 등록하면 409와 FAVORITE409_1을 응답한다', async () => {
    await favoriteRepository.save(
      favoriteRepository.create({ member, movieId: 550 }),
    );

    const response = await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', authorization)
      .send({ movieId: 550 })
      .expect(409);

    expect(response.body.code).toBe('FAVORITE409_1');
  });

  it('즐겨찾기하지 않은 영화의 여부를 조회하면 200과 isFavorite false를 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .get('/favorites/550')
      .set('Authorization', authorization)
      .expect(200);

    expect(response.body.result.isFavorite).toBe(false);
  });
});
