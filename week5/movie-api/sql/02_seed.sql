USE umc_movie;

-- password 자리에는 평문 비밀번호를 넣지 않아요. 6주차에 bcrypt 해시로 채워져요.
INSERT INTO member (email, password, nickname) VALUES
('jun@umc.com',    '$2a$10$dummyEncodedPasswordValue', '준영'),
('noco@umc.com',   '$2a$10$dummyEncodedPasswordValue', '수현'),
('minseo@umc.com', '$2a$10$dummyEncodedPasswordValue', '민서');

-- movie_id는 TMDB의 실제 영화 ID예요. (550=파이트 클럽, 155=다크 나이트, 157336=인터스텔라)
INSERT INTO rating (member_id, movie_id, score, comment) VALUES
(1, 550,    5, '최고의 영화!'),
(1, 155,    4, '다시 봐도 명작'),
(1, 157336, 5, '우주 장면이 압도적'),
(2, 550,    3, '호불호가 갈릴 것 같아요');
