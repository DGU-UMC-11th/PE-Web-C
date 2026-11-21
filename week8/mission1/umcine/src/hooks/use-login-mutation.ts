import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { login, type LoginRequest } from "../api/auth/login";
import { MY_INFO_QUERY_KEY } from "../api/members/get-my-info";
import { useAuthStore } from "../stores/auth-store";
import { beginLoginRequest, finishLoginRequest, isCurrentLoginRequest } from "../utils/login-request";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => {
    const controller = request.current;
    if (!controller) return;
    controller.abort();
    finishLoginRequest(controller);
    request.current = null;
  }, []);

  const mutation = useMutation({
    mutationFn: ({ body, controller }: { body: LoginRequest; controller: AbortController }) =>
      login(body, controller.signal),
    onSuccess: (result, { controller }) => {
      if (!isCurrentLoginRequest(controller)) return;
      useAuthStore.getState().setAccessToken(result.accessToken);
      void queryClient.invalidateQueries({ queryKey: MY_INFO_QUERY_KEY });
      window.alert("로그인에 성공했어요.");
      void navigate({ to: "/" });
    },
    onSettled: (_data, _error, { controller }) => {
      if (request.current === controller) request.current = null;
      finishLoginRequest(controller);
    },
  });

  function submit(body: LoginRequest) {
    if (request.current || mutation.isPending) return;
    const controller = beginLoginRequest();
    request.current = controller;
    mutation.mutate({ body, controller });
  }

  return { ...mutation, submit };
}
