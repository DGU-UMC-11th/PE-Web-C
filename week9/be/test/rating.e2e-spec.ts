import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { RatingController } from '../src/controller/rating.controller';
import { Member } from '../src/entity/member.entity';
import { Rating } from '../src/entity/rating.entity';
import { RatingService } from '../src/service/rating.service';
import { bearerToken, createTestApp } from './create-test-app';

describe('평점 API (통합 테스트)', () => {
  let app: INestApplication;
  let ratingRepository: Repository<Rating>;
  let authorization: string;

  beforeAll(async () => {
    const testApp = await createTestApp({
      entities: [Member, Rating],
      controllers: [RatingController],
      providers: [RatingService],
    });
    app = testApp.app;

    const memberRepository = testApp.moduleFixture.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
    ratingRepository = testApp.moduleFixture.get(getRepositoryToken(Rating));

    const member = await memberRepository.save(
      memberRepository.create({
        email: 'challenger@umc.com',
        password: '$2b$10$abcdefghijklmnopqrstuv',
        nickname: '영화조아',
      }),
    );
    authorization = bearerToken(testApp.moduleFixture, member);
  });

  beforeEach(async () => {
    await ratingRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('토큰 없이 평점을 등록하면 401과 AUTH401_2를 응답하고 평점이 저장되지 않는다', async () => {
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .send({ movieId: 550, score: 5, comment: '다시 봐도 명작이에요.' })
      .expect(401);

    expect(response.body.isSuccess).toBe(false);
    expect(response.body.code).toBe('AUTH401_2');
    expect(await ratingRepository.count()).toBe(0);
  });

  it('토큰을 담아 평점을 등록하면 201과 저장된 평점을 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .set('Authorization', authorization)
      .send({ movieId: 550, score: 5, comment: '다시 봐도 명작이에요.' })
      .expect(201);

    expect(response.body.code).toBe('COMMON201');
    expect(response.body.result).toMatchObject({ movieId: 550, score: 5 });
    expect(await ratingRepository.count()).toBe(1);
  });
});
