/// <reference types="vite/client" />

// .env.local에 둔 VITE_ 환경 변수의 타입이에요. (값이 없으면 undefined)
interface ImportMetaEnv {
  readonly VITE_TMDB_API_BASE_URL?: string;
  readonly VITE_TMDB_ACCESS_TOKEN?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
