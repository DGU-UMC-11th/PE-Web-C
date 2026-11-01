import { umcClient } from "../umc-client";
import type { AvailabilityResponse } from "./models";

type CheckEmailResponse = AvailabilityResponse;

function checkEmail(email: string) {
  return umcClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckEmailResponse>();
}

export { checkEmail, type CheckEmailResponse };
