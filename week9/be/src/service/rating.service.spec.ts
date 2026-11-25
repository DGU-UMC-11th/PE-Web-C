import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from '../entity/member.entity';
import { Rating } from '../entity/rating.entity';
import { RatingService } from './rating.service';

describe('RatingService', () => {
  let ratingService: RatingService;

  const ratingRepository = {
    exists: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const memberRepository = {
    findOneBy: jest.fn(),
  };

  const member = { memberId: 1, nickname: '영화조아' } as Member;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: getRepositoryToken(Rating), useValue: ratingRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();

    ratingService = module.get(RatingService);
  });

  it('같은 영화에 평점을 다시 등록하면 RATING409_1 예외를 던지고 저장하지 않는다', async () => {
    // given: 회원은 있고, 이 영화에 이미 평점을 남긴 상황
    memberRepository.findOneBy.mockResolvedValue(member);
    ratingRepository.exists.mockResolvedValue(true);

    // when & then: RATING409_1 예외가 나고, 저장은 시도하지 않는다
    await expect(
      ratingService.create(1, { movieId: 550, score: 5 }),
    ).rejects.toMatchObject({ code: 'RATING409_1' });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });

  it('다른 회원이 남긴 평점을 수정하려 하면 RATING403_1 예외를 던지고 저장하지 않는다', async () => {
    // given: 1번 평점은 2번 회원이 남긴 평점인 상황
    ratingRepository.findOne.mockResolvedValue({
      ratingId: 1,
      movieId: 550,
      score: 5,
      comment: null,
      member: { memberId: 2 },
    });

    // when & then: 1번 회원이 수정하면 RATING403_1 예외가 나고, 평점은 바뀌지 않는다
    await expect(
      ratingService.update(1, 1, { score: 1 }),
    ).rejects.toMatchObject({ code: 'RATING403_1' });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });
});
