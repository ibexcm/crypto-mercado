import expressJWT from "express-jwt";

export interface IJWTRepository {
  auth: {
    optional: expressJWT.RequestHandler;
  };
  sign: <Payload = unknown>(
    payload: Payload,
    options?: { expiresIn?: string | number },
  ) => string;
}
