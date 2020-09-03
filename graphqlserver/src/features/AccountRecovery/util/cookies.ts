import ms from "ms";

export async function createCookie({ duration = "15m" }: { duration?: string } = {}) {
  const expiresIn = ms(duration);
  return {
    httpOnly: true,
    expires: new Date(Date.now() + expiresIn),
  };
}
