-- 비밀번호 자리에는 실제 비밀번호가 아니라 bcrypt 해시 모양의 더미 값만 넣어요.
INSERT INTO member (email, password, nickname, created_at, updated_at) VALUES
('jun@umc.com',    '$2a$10$dummydummydummydummydummydummydummydummydummydummydu', '준영', NOW(6), NOW(6)),
('noco@umc.com',   '$2a$10$dummydummydummydummydummydummydummydummydummydummydu', '수현', NOW(6), NOW(6)),
('minseo@umc.com', '$2a$10$dummydummydummydummydummydummydummydummydummydummydu', '민서', NOW(6), NOW(6));

-- movie_id 는 TMDB 영화 id 예요. (550 파이트 클럽, 155 다크나이트, 157336 인터스텔라)
INSERT INTO rating (member_id, movie_id, score, comment, created_at, updated_at) VALUES
(1, 550,    9, '두 번째 볼 때 더 좋았어요.', NOW(6), NOW(6)),
(1, 155,   10, '조커가 전부 다 했어요.',     NOW(6), NOW(6)),
(1, 157336, 8, '음악이 계속 남아요.',        NOW(6), NOW(6)),
(2, 550,    7, '분위기가 독특해요.',         NOW(6), NOW(6));
