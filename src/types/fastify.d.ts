import "fastify";
import { LdapUser } from "core/server/authentication/ldap";

declare module "fastify" {
  interface FastifyRequest {
    user?: LdapUser;
  }
}
