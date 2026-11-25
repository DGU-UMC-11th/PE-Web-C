import { QueryFailedError } from 'typeorm';

// 사전 중복 검사를 동시에 통과한 요청은 DB UNIQUE 제약에서 ER_DUP_ENTRY로 막힘
export function isDuplicateEntryError(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string } | undefined)?.code ===
      'ER_DUP_ENTRY'
  );
}
