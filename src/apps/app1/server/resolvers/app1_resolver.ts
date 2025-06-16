import { AppContext } from "core/server/authentication/graphqlContext";

export default {
  Query: {
    getFromApp1: async (_: any, __: any, context: AppContext) => {
      return Promise.resolve().then(() => "Hi there app1");
    },
    getWithArgumentsFromApp1: async (_: any, { text }: { text: string }) => {
      return Promise.resolve().then(() => `Hi there app1 ${text}`);
    },
  },
};
