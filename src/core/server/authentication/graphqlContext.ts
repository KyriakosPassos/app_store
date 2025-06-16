import type { ApolloFastifyContextFunction } from "@as-integrations/fastify";
import type { BaseContext } from "@apollo/server";
import { LdapUser } from "./ldap";

export interface AppContext extends BaseContext {
  readonly user?: LdapUser | undefined;
}

type CoreCtxFn = ApolloFastifyContextFunction<CoreContext>;
type CoreRequest = Parameters<CoreCtxFn>[0];
type CoreReply = Parameters<CoreCtxFn>[1];

export interface CoreContext extends BaseContext {
  user?: LdapUser | undefined;
  request: Partial<CoreRequest>;
  reply: CoreReply;
}

export const buildContextForCore: ApolloFastifyContextFunction<
  CoreContext
> = async (request, reply) => {
  return {
    request: request,
    reply,
    user: (request as any).user,
  };
};

export const buildContextForApp: ApolloFastifyContextFunction<
  AppContext
> = async (request, _) => {
  return { user: (request as any).user };
};
