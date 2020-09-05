import { CookieOptions } from "express-serve-static-core";

export type Cookie = [string, any, CookieOptions];

export interface ICookiesGenRepository {
  createCookie(value: any, name?: string, secOptions?: boolean): Promise<Cookie>;
  secureOptions(expiration?: string): Promise<CookieOptions>;
}
