import { Request } from "express";
import expressJWT from "express-jwt";
import * as jsonwebtoken from "jsonwebtoken";
import { config } from "../../../config";

let { privateKey, publicKey, algorithm, audience, issuer } = config.get("jwt") as any;

export function sign<Payload = unknown>(
  payload: Payload,
  options?: { expiresIn?: string | number },
) {
  return jsonwebtoken.sign(payload as any, Buffer.from(privateKey, "base64"), {
    audience,
    algorithm,
    issuer,
    expiresIn: "7days",
    ...options,
  });
}

export function verify<Payload = unknown>(token: string) {
  return <Payload>(<unknown>jsonwebtoken.verify(token, Buffer.from(publicKey, "base64"), {
    issuer,
    audience,
    algorithms: [algorithm],
  }));
}

export function getTokenFromRequest({
  headers: { authorization },
  query,
  cookies,
}: Request) {
  if (authorization && authorization.startsWith("Bearer")) {
    return authorization.replace("Bearer ", "");
  }

  if (query && query.token) {
    return query.token;
  }

  if (cookies && cookies.token) {
    return cookies.token;
  }
}

export const auth = {
  optional: expressJWT({
    credentialsRequired: false,
    userProperty: "auth",
    audience,
    algorithms: [algorithm],
    secret: Buffer.from(privateKey, "base64"),
    getToken: getTokenFromRequest,
  }),
};

export const JWTRepository = {
  auth,
  sign,
};

export default JWTRepository;
