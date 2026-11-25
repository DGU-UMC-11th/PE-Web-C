import { apiClient } from "../api-client";

interface CheckNicknameDuplicateResponse {
  available: boolean;
}

function checkNicknameDuplicate(nickname: string) {
  return apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckNicknameDuplicateResponse>();
}

export { checkNicknameDuplicate, type CheckNicknameDuplicateResponse };
