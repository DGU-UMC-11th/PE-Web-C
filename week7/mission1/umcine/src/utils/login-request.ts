// 컴포넌트가 달라도 가장 최근의 로그인 요청만 유효해요.
let currentRequest: AbortController | null = null;

export function beginLoginRequest() {
  currentRequest?.abort();
  currentRequest = new AbortController();
  return currentRequest;
}

export function isCurrentLoginRequest(request: AbortController) {
  return currentRequest === request && !request.signal.aborted;
}

export function finishLoginRequest(request: AbortController) {
  if (currentRequest === request) currentRequest = null;
}

export function cancelPendingLogin() {
  currentRequest?.abort();
  currentRequest = null;
}
