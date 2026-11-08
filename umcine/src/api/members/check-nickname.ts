import { umcClient } from "../umc-client";
import type { AvailabilityResponse } from "./models";

type CheckNicknameResponse = AvailabilityResponse;

// path param에 한글·공백·특수문자가 들어가도 안전하도록 encodeURIComponent로 감싸요.
function checkNickname(nickname: string) {
  return umcClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckNicknameResponse>();
}

export { checkNickname, type CheckNicknameResponse };
