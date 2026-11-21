export function getTokenMemberId(accessToken: string) {
  const payload = accessToken.split(".")[1];
  if (!payload) return undefined;

  try {
    // JWT의 식별자는 URL 경로에만 사용하고 인증 여부는 서버가 판단해요.
    const base64 = payload.replaceAll("-", "+").replaceAll("_", "/");
    const claims = JSON.parse(atob(base64)) as { sub?: unknown; memberId?: unknown };
    const claim = claims.memberId ?? claims.sub;
    const id = typeof claim === "string" && /^[0-9]+$/.test(claim) ? Number(claim) : claim;
    if (typeof id === "number" && Number.isSafeInteger(id) && id > 0) return id;
  } catch {
    return undefined;
  }
}
