import type { FastifyRequest, FastifyReply } from "fastify";
import type { BaseContext } from "@apollo/server";
import { LdapUser } from "./ldap";

export interface AppContext extends BaseContext {
  user?: LdapUser | undefined;
}

export interface CoreContext extends BaseContext {
  user?: LdapUser | undefined;
  request: FastifyRequest;
  reply: FastifyReply;
}

// This is our new, conditional context builder.
// It returns a union type, promising one of the two context shapes.
export const buildContext = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<CoreContext | AppContext> => {
  // Check if the request is for the app GraphQL endpoint. Build and return the limited AppContext.
  const a = request.url;
  if (request.url.includes("/graphql/")) {
    return {
      user: (request as any).user,
    };
  }

  // Otherwise, it's a core request.
  return {
    request,
    reply,
    user: (request as any).user,
  };
};
