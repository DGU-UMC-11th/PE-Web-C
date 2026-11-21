import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup } from "../api/members/signup";

export function useSignupMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      window.alert(response.message || "회원가입에 성공했어요.");
      void navigate({ to: "/login" });
    },
  });
}
