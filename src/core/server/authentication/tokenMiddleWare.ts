import { FastifyRequest, FastifyReply } from "fastify";
import { signAccessToken, verifyAccessToken, verifyRefreshToken } from "./auth";
import { LdapUser } from "./ldap";

export const tokenMiddleWare = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (isLoginRequest(request)) {
    (request as any).user = undefined;
    return;
  }
  const { accessToken, refreshToken } = request.cookies;
  if (!accessToken && !refreshToken) {
    return reply.status(401).send({ error: "Not authenticated" });
  }

  if (accessToken) {
    const userInfo = verifyAccessToken(accessToken);
    if (userInfo) {
      addUserToContext(request, userInfo);
      const a = request.headers;
      const b = request.host;
      const c = request.hostname;
      return;
    }
    return reply.status(401).send({
      error: "Something went wrong with the access token authentication",
    });
  }

  if (refreshToken) {
    const userInfo = verifyRefreshToken(refreshToken);
    if (!userInfo) {
      return reply.status(401).send({
        error: "Something went wrong with the refresh token authentication",
      });
    }
    const newAccessToken = signAccessToken(userInfo);
    reply.setCookie("accessToken", newAccessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 3600,
    });
    addUserToContext(request, userInfo);
    return;
  }
  return;
};

const addUserToContext = (request: FastifyRequest, userInfo: LdapUser) => {
  (request as any).user = userInfo as LdapUser;
};

const isLoginRequest = (request: FastifyRequest) => {
  const body = request.body as { operationName?: string };
  return body?.operationName === "loginUser";
};
