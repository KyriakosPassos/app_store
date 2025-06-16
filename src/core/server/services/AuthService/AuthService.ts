import {
  signAccessToken,
  signRefreshToken,
} from "core/server/authentication/auth";
import { authenticateLdap } from "core/server/authentication/ldap";
import { CoreContext } from "../../authentication/graphqlContext";

export interface LoginResult {
  success: boolean;
  reason: string;
}

export namespace AuthService {
  export const loginUser = async (
    firstName: string,
    lastName: string,
    context: CoreContext
  ): Promise<LoginResult> => {
    let ldapUser;
    try {
      ldapUser = await authenticateLdap(firstName, lastName);
    } catch (err: any) {
      return { success: false, reason: err };
    }
    const accessToken = signAccessToken(ldapUser);
    const refreshToken = signRefreshToken(ldapUser);

    context.reply.setCookie("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1h
    });
    context.reply.setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8, // 8h
    });

    return { success: true, reason: "" };
  };

  export const logoutUser = async (context: CoreContext): Promise<boolean> => {
    context.reply.clearCookie("accessToken", { path: "/" });
    context.reply.clearCookie("refreshToken", { path: "/" });
    return true;
  };
}
