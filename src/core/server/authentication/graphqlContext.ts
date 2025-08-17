import type { FastifyRequest, FastifyReply } from "fastify";
import type { BaseContext } from "@apollo/server";
import { query as baseQuery } from "../database/database";
import { LdapUser } from "./ldap";

export interface AppContext extends BaseContext {
  user?: LdapUser | undefined;
  db: { query: ContextualQuery };
}

export interface CoreContext extends BaseContext {
  user?: LdapUser | undefined;
  db: { query: ContextualQuery };
  request: FastifyRequest;
  reply: FastifyReply;
}

// This function determines which tenant is making the request.
// In a real application, you might get this from a subdomain (e.g., app1.yourdomain.com),
// a JWT claim, or a special HTTP header.
const getTenantSchemaFromRequest = (request: FastifyRequest): string => {
  // Example: using the URL path like /graphql/app1
  const match = request.url.match(/\/graphql\/(\w+)/);
  if (match && match[1]) {
    // Sanitize to prevent SQL injection. Only allow alphanumeric characters.
    return match[1].replace(/[^a-zA-Z0-9_]/g, "");
  }
  // Default to the public schema for core requests or if no app is specified
  return "core";
};

type ContextualQuery = <T>(sql: string, params: any[]) => Promise<T[]>;

// This is our new, conditional context builder.
// It returns a union type, promising one of the two context shapes.
export const buildContext = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<CoreContext | AppContext> => {
  const tenantSchema = getTenantSchemaFromRequest(request);
  const contextualQuery: ContextualQuery = <T>(sql: string, params: any[]) =>
    baseQuery<T>(tenantSchema, sql, params);

  const db = { query: contextualQuery };

  // Check if the request is for the app GraphQL endpoint. Build and return the limited AppContext.
  if (request.url.includes("/graphql/")) {
    return {
      user: (request as any).user,
      db,
    };
  }

  // Otherwise, it's a core request.
  return {
    request,
    reply,
    user: (request as any).user,
    db,
  };
};
