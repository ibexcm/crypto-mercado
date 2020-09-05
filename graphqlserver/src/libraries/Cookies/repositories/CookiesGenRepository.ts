import ms from "ms";
import { DateTime } from "luxon";
import { CookieOptions } from "express-serve-static-core";
import { Cookie, ICookiesGenRepository } from "../interfaces";

const secureOptions: ICookiesGenRepository["secureOptions"] = async (
  expiration = "15min",
): Promise<CookieOptions> => {
  try {
    const maxAge = ms(expiration);
    const expires = new Date(
      DateTime.utc()
        .plus({ milliseconds: maxAge })
        .toISO(),
    );

    const secureOptions: CookieOptions = {
      httpOnly: true,
      maxAge,
      expires,
    };

    return secureOptions;
  } catch (err) {}
};

const createCookie: ICookiesGenRepository["createCookie"] = async (
  value,
  name = "authToken",
  secOptions = true,
): Promise<Cookie> => {
  try {
    let cookieOptions;

    if (!Boolean(secOptions)) {
      cookieOptions = {};
    }
    cookieOptions = await secureOptions();

    return [name, value, cookieOptions];
  } catch (err) {}
};

export const CookiesGenRepository: ICookiesGenRepository = {
  createCookie,
  secureOptions,
};
