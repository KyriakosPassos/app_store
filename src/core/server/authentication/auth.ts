import { LdapUser } from "./ldap";
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = "some-access-secret";
const REFRESH_TOKEN_SECRET = "some-refresh-secret";
const ACCESS_TOKEN_EXPIRES_IN = "1h";
const REFRESH_TOKEN_EXPIRES_IN = "8h";

export const signAccessToken = (payload: LdapUser): string =>
  jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

export const verifyAccessToken = (token: string): LdapUser => {
  const decoded: LdapUser = jwt.verify(token, ACCESS_TOKEN_SECRET);
  if (checkValidityOfDecoding(decoded)) {
    throw new Error("Invalid access token payload");
  }
  return {
    firstName: decoded.firstName,
    lastName: decoded.lastName,
    email: decoded.email,
    sAMAccountName: decoded.sAMAccountName,
  };
};

export const signRefreshToken = (payload: LdapUser): string =>
  jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

export const verifyRefreshToken = (token: string): LdapUser => {
  const decoded: LdapUser = jwt.verify(token, REFRESH_TOKEN_SECRET);
  if (checkValidityOfDecoding(decoded)) {
    throw new Error("Invalid refresh token payload");
  }
  return {
    firstName: decoded.firstName,
    lastName: decoded.lastName,
    email: decoded.email,
    sAMAccountName: decoded.sAMAccountName,
  };
};

const checkValidityOfDecoding = (decoded: LdapUser): boolean =>
  typeof decoded !== "object" ||
  typeof decoded.firstName !== "string" ||
  typeof decoded.lastName !== "string" ||
  typeof decoded.email !== "string" ||
  typeof decoded.sAMAccountName !== "string";
