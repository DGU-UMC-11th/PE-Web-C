# UMCine

이전 주차에 만든 영화 앱에 회원가입, 로그인, 내 정보 조회·수정 기능을 이어서 구현한 프로젝트입니다.

## 실행

Node.js 22.12 이상과 pnpm을 설치한 뒤, 이 폴더에서 실행합니다.

```bash
pnpm install
pnpm dev
```

## 환경 변수

프로젝트 루트에 `.env.local`을 만들고 아래 값을 설정합니다. 실제 토큰은 커밋하지 않습니다.

```dotenv
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=YOUR_TMDB_READ_ACCESS_TOKEN
VITE_API_BASE_URL=http://localhost:8080
```

- `VITE_TMDB_API_BASE_URL`, `VITE_TMDB_ACCESS_TOKEN`: 필수입니다. 누락되면 앱 초기화 시 오류가 발생합니다.
- `VITE_API_BASE_URL`: 선택입니다. 생략하면 `http://localhost:8080`을 사용합니다.
- TMDB 토큰에는 API 읽기 액세스 토큰을 입력합니다. 위 예시에는 실제 키가 포함되어 있지 않습니다.

회원가입·중복 확인·로그인·내 정보 기능을 사용하려면 회원 서버도 실행해야 합니다. 서버의 CORS 허용 주소에 맞춰 프런트엔드는 `http://localhost:5173`으로 접속합니다.

## 주요 경로

- `/`: 영화 목록
- `/search`: 영화 검색
- `/signup`: 회원가입
- `/login`: 로그인
- `/mypage`: 내 정보 조회
- `/mypage/edit`: 닉네임 수정

로그인은 같은 탭의 새로고침까지 유지되며, 북마크는 브라우저에 저장됩니다.
