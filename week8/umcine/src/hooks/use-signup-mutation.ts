import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup } from "../api/members/signup";

/**
 * 7주차에 직접 만들던 isSubmitting / try-catch가 useMutation 안으로 들어왔어요.
 * try의 성공 처리는 onSuccess로, catch의 실패 처리는 onError로 옮겼어요.
 */
export function useSignupMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      alert(response.message);
      navigate({ to: "/login" });
    },
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
