import { apiClient } from "../api-client";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    accessToken: string;
  };
}

// 로그인은 인증이 필요 없는 요청이라 apiClient로 보내요.
function login(body: LoginRequest) {
  return apiClient.post("auth/login", { json: body }).json<LoginResponse>();
}

export { login, type LoginRequest, type LoginResponse };
