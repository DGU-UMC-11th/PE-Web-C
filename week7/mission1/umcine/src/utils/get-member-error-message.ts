import { isHTTPError } from "ky";
import { MemberResponseError } from "../api/api-response";

export function getMemberErrorMessage(error: unknown, fallback: string) {
  if (error instanceof MemberResponseError) return error.message;
  if (isHTTPError(error)) {
    // ky 2는 HTTP 오류 응답의 JSON을 data에 담아요.
    const data: unknown = error.data;
    if (data && typeof data === "object" && "message" in data &&
        typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  }
  return fallback;
}
