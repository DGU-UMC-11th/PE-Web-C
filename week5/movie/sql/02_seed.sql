-- 더미 데이터 (password는 실제 비밀번호가 아닌 임의 문자열)
-- INSERT IGNORE: 여러 번 실행해도 UNIQUE 제약 때문에 중복으로 들어가지 않아요.
USE umc_movie;

INSERT IGNORE INTO member (email, password, nickname) VALUES
('noco@umc.com', '$2a$10$dummyEncodedPasswordValue', '수현'),
('minseo@umc.com', '$2a$10$dummyEncodedPasswordValue', '민서');

INSERT IGNORE INTO rating (member_id, movie_id, score, comment) VALUES
(1, 550, 5, '최고의 영화!'),
(1, 155, 4, '다시 봐도 명작'),
(2, 550, 3, '호불호가 갈릴 것 같아요');
