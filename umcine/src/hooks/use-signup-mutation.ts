import { mutationOptions, useMutation } from "@tanstack/react-query";
import { signup } from "../api/members/signup";

export const signupMutationOptions = mutationOptions({
  mutationKey: ["members", "signup"],
  mutationFn: signup,
});

export function useSignupMutation() {
  return useMutation(signupMutationOptions);
}
