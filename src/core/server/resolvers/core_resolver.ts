import { CoreContext } from "../authentication/graphqlContext";
import { AuthService, LoginResult } from "../services/AuthService/AuthService";

export default {
  Query: {
    someCoreResolver: async () => {
      return Promise.resolve().then(() => "Hi there core");
    },
    getCurrentUser: async (_: any, __: any, context: CoreContext) => {
      return context.user;
    },
  },
  Mutation: {
    loginUser: async (
      _: any,
      { firstName, lastName }: { firstName: string; lastName: string },
      context: CoreContext
    ): Promise<LoginResult> => {
      return AuthService.loginUser(firstName, lastName, context);
    },
    logoutUser: async (
      _: any,
      _args: {},
      context: CoreContext
    ): Promise<boolean> => {
      return AuthService.logoutUser(context);
    },
  },
};
