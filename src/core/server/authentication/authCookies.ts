import { FastifyReply } from "fastify";
import { signAccessToken, signRefreshToken } from "./auth";
import { LdapUser } from "./ldap";

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
} as const;

export const setAuthCookies = (reply: FastifyReply, payload: LdapUser) => {
  setAccessCookie(reply, payload);

  const refreshToken = signRefreshToken(payload);
  reply.setCookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 8,
  });
};

export const setAccessCookie = (reply: FastifyReply, payload: LdapUser) => {
  const accessToken = signAccessToken(payload);
  reply.setCookie(ACCESS_TOKEN_COOKIE, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60,
  });
};

export const clearAuthCookies = (reply: FastifyReply) => {
  reply.clearCookie(ACCESS_TOKEN_COOKIE, { path: "/" });
  reply.clearCookie(REFRESH_TOKEN_COOKIE, { path: "/" });
};
