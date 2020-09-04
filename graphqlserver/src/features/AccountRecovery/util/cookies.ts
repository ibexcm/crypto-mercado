import { CookieOptions } from "express-serve-static-core";
import ms from "ms";

export async function createSecureCookieOptions({
  duration = "15m",
}: { duration?: string } = {}): Promise<CookieOptions> {
  const expiresIn = ms(duration);
  const cookieSecureOptions: CookieOptions = {
    httpOnly: true,
    maxAge: expiresIn,
    expires: new Date(Date.now() + expiresIn),
  };

  return cookieSecureOptions;
}
