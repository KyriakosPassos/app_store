import { AttributeJson, Client, createClient, SearchEntry } from "ldapjs";

export interface LdapUser {
  firstName: string;
  lastName: string;
  sAMAccountName: string;
  email?: string;
}
const {
  LDAP_URL = "test",
  LDAP_BIND_DN = "test",
  LDAP_BIND_PW = "test",
  LDAP_BASE_DN = "test",
} = process.env;

const getFieldOfUser = (
  obj: AttributeJson[],
  field: "sn" | "givenName" | "mail" | "sAMAccountName"
) => {
  const result = obj.find((el) => el.type === field);
  return result!.values[0];
};

const makeLdapClient = (): Client =>
  createClient({
    url: LDAP_URL,
    connectTimeout: 5000,
    timeout: 5000,
    idleTimeout: 5000,
    reconnect: false,
  });

const bindWithTimeouts = (
  client: Client,
  dn: string,
  pw: string
): Promise<void> => {
  return new Promise((res, rej) => {
    const onError = () => {
      rej("Failed to connect, please connect to correct vpn and try again.");
    };
    client.on("error", onError);
    client.on("connectError", onError);
    client.bind(dn, pw, (err) => {
      if (err) return cleanup();
      res();
    });
    const cleanup = () => {
      client.off("error", onError);
      client.off("connectError", onError);
      client.destroy();
    };
  });
};

export async function authenticateLdap(
  username: string,
  password: string
): Promise<LdapUser> {
  const client: Client = makeLdapClient();
  try {
    await bindWithTimeouts(client, LDAP_BIND_DN, LDAP_BIND_PW);
  } catch (err) {
    throw new Error(err as string);
  }

  let ldapUser: LdapUser | null = null;
  await new Promise<void>((res, rej) => {
    client.search(
      LDAP_BASE_DN,
      {
        filter: `&(objectClass=user)(sAMAccountName=${username})`,
        scope: "sub",
        attributes: ["sn", "givenName", "mail", "sAMAccountName"],
      },
      (err, resLdap) => {
        if (err) return rej(err);
        resLdap.on("searchEntry", (entry: SearchEntry) => {
          // use .pojo to get a plain object
          const obj = entry.pojo.attributes;
          ldapUser = {
            lastName: getFieldOfUser(obj, "sn"),
            firstName: getFieldOfUser(obj, "givenName"),
            sAMAccountName: getFieldOfUser(obj, "sAMAccountName"),
            email: getFieldOfUser(obj, "mail"),
          };
        });
        resLdap.on("error", rej);
        resLdap.on("end", () => (ldapUser ? res() : rej("User not found")));
      }
    );
  });

  // 3) Now bind AS THAT USER to verify the password
  await new Promise<void>((res, rej) =>
    client.bind(
      `${ldapUser!.firstName} ${ldapUser!.lastName}`,
      password,
      (err) => (err ? rej("Invalid password") : res())
    )
  );

  // 4) Clean up the connection
  client.unbind();

  return ldapUser!;
}
