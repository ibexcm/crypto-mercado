import { CookieOptions } from "express-serve-static-core";
import { DateTime } from "luxon";
import ms from "ms";

export async function createSecureCookieOptions({
  duration = "15m",
}: { duration?: string } = {}): Promise<CookieOptions> {
  const expiresIn = ms(duration);
  const expiresAt = new Date(
    DateTime.utc()
      .plus({ milliseconds: expiresIn })
      .toISO(),
  );
  const cookieSecureOptions: CookieOptions = {
    httpOnly: true,
    maxAge: expiresIn,
    expires: expiresAt,
  };

  return cookieSecureOptions;
}
