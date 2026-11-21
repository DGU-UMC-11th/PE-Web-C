export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export class MemberResponseError extends Error {}

function assertApiSuccess(response: ApiResponse<unknown>) {
  if (response?.isSuccess !== true) {
    throw new MemberResponseError(response?.message || "요청을 처리하지 못했어요.");
  }
}

export function getApiResult<T>(response: ApiResponse<T>): T {
  assertApiSuccess(response);
  if (response.result == null) {
    throw new MemberResponseError(response.message || "요청을 처리하지 못했어요.");
  }
  return response.result;
}

export async function checkMutationResponse(response: Response) {
  const body = await response.text();
  if (body.trim()) {
    assertApiSuccess(JSON.parse(body) as ApiResponse<unknown>);
  }
}
