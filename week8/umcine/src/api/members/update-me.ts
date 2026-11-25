import { authApi } from "../auth-api";
import type { ApiResponse } from "../types";
import type { MemberInfo } from "./me";

interface UpdateMeRequest {
  nickname: string;
}

type UpdateMeResponse = ApiResponse<MemberInfo>;

function updateMe(body: UpdateMeRequest) {
  return authApi.patch("members/me", { json: body }).json<UpdateMeResponse>();
}

export { updateMe, type UpdateMeRequest, type UpdateMeResponse };
