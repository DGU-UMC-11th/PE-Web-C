// 이메일 형식 검사
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 (백엔드 SignUpRequest의 @Pattern과 같은 규칙)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value.trim());
export const isValidNickname = (value: string) => {
  const length = value.trim().length;
  return length >= 2 && length <= 12;
};
export const isValidPassword = (value: string) => PASSWORD_REGEX.test(value);
