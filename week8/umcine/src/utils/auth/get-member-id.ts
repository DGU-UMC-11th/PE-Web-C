// GET /members/me는 memberId를 주지 않아서, 토큰 payload의 sub(회원 ID)를 읽어요.
// payload는 Base64URL 인코딩이라 비밀키 없이 디코딩할 수 있어요. (검증은 서버가 해요)
export function getMemberIdFromToken(accessToken: string | null) {
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = new TextDecoder().decode(
      Uint8Array.from(atob(base64), (char) => char.charCodeAt(0)),
    );
    const memberId = Number(JSON.parse(json).sub);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
