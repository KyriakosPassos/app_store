export default {
  Query: {
    getFromApp2: async () => {
      return Promise.resolve().then(() => "Hi there app2");
    },
  },
};
