import Fastify, { FastifyInstance, RawServerBase } from "fastify";
import { ApolloServer, BaseContext } from "@apollo/server";
import {
  fastifyApolloDrainPlugin,
  fastifyApolloHandler,
} from "@as-integrations/fastify";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { fastifyCors } from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import { tokenMiddleWare } from "./authentication/tokenMiddleWare";
import {
  buildContextForApp,
  buildContextForCore,
} from "./authentication/graphqlContext";

const path = require("path");

let coreResolvers: any[] = [];
let coreSchema = "";

//  Loads all resolver modules from a directory.
//  Each file should export an object (either as default or named export).

const loadResolversFromDir = (directory: string): any[] => {
  const resolversArray: any[] = [];
  if (!existsSync(directory)) return resolversArray;
  const files = readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (
      statSync(fullPath).isFile() &&
      (file.endsWith(".js") || file.endsWith(".ts"))
    ) {
      const mod = require(fullPath);
      const exported = mod.default || mod;
      resolversArray.push(exported);
    }
  }
  return resolversArray;
};

// Reads a GraphQL schema from a file.
const loadSchemaFromFile = (filePath: string): string => {
  if (existsSync(filePath)) {
    return readFileSync(filePath, "utf8");
  }
  return "";
};

// Creates an Apollo Server instance for the Core API.
const createCoreApolloServer = async <T extends RawServerBase>(
  fastify: FastifyInstance<T>
): Promise<ApolloServer<BaseContext>> => {
  const coreSchemaPath = path.join(__dirname, "graphql", "core.schema.graphql");
  const coreTypeDefs = loadSchemaFromFile(coreSchemaPath);
  coreSchema = coreTypeDefs;
  const coreResolversDir = path.join(__dirname, "resolvers");
  const coreResolversArray = loadResolversFromDir(coreResolversDir);
  coreResolvers = coreResolversArray;
  const mergedTypeDefs = mergeTypeDefs([coreTypeDefs]);
  const mergedResolvers = mergeResolvers(coreResolversArray);

  const apolloServer = new ApolloServer<BaseContext>({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [fastifyApolloDrainPlugin(fastify)],
  });
  await apolloServer.start();
  return apolloServer;
};

// Creates an Apollo Server instance for an app by merging its schema/resolvers with the core’s.
const createAppApolloServer = async <T extends RawServerBase>(
  appDir: string,
  appName: string,
  fastify: FastifyInstance<T>
): Promise<ApolloServer<BaseContext>> => {
  // Load app-specific schema/resolvers
  const appSchemaPath = path.join(
    appDir,
    "server",
    "graphql",
    `${appName}.schema.graphql`
  );
  const appTypeDefs = loadSchemaFromFile(appSchemaPath);
  const appResolversDir = path.join(appDir, "server", "resolvers");
  const appResolversArray = loadResolversFromDir(appResolversDir);

  // Merge core and app definitions
  const mergedTypeDefs = mergeTypeDefs(
    [coreSchema, appTypeDefs].filter(Boolean)
  );
  const mergedResolvers = mergeResolvers([
    ...coreResolvers,
    ...appResolversArray,
  ]);

  const apolloServer = new ApolloServer<BaseContext>({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [fastifyApolloDrainPlugin(fastify)],
  });
  await apolloServer.start();
  return apolloServer;
};

// Registers apollo endpoint to fastify
const registerApolloToFastify = <T extends RawServerBase>(
  fastify: FastifyInstance<T>,
  apolloServer: ApolloServer<BaseContext>,
  path?: string
) => {
  const handler = !path
    ? fastifyApolloHandler(apolloServer, {
        context: buildContextForCore,
      })
    : (fastifyApolloHandler(apolloServer, {
        context: buildContextForApp,
      }) as any);
  fastify.route({
    method: ["GET", "POST", "OPTIONS"],
    url: `${path ? `/graphql/${path}` : "/graphql"}`,
    handler,
  });
};

// Bootstraps the Fastify server and registers Apollo Server handlers.
const startServer = async () => {
  const fastify = Fastify({ logger: true });
  fastify.decorateRequest("user", undefined);
  fastify.register(fastifyCors, {
    origin: /^https?:\/\/localhost:\d+$/,
    credentials: true,
  });
  fastify.register(fastifyCookie, {
    secret: "fastifyCookieSecret",
    parseOptions: {},
  });
  fastify.addHook("preValidation", tokenMiddleWare);
  // Register the core Apollo Server at /graphql
  const coreApolloServer = await createCoreApolloServer(fastify);
  registerApolloToFastify(fastify, coreApolloServer);

  // Locate apps dynamically.
  const appsFolder = path.join(__dirname, "../../apps");
  if (existsSync(appsFolder)) {
    const appFolders = readdirSync(appsFolder).filter((file) => {
      const fullPath = path.join(appsFolder, file);
      return statSync(fullPath).isDirectory();
    });
    for (const appName of appFolders) {
      const appDir = path.join(appsFolder, appName);
      const appApolloServer = await createAppApolloServer(
        appDir,
        appName,
        fastify
      );
      // Register each app's Apollo Server at /graphql/<appName>
      registerApolloToFastify(fastify, appApolloServer, appName);
    }
  }

  try {
    await fastify.listen({
      port: process.env.PORT ? parseInt(process.env.PORT) : 9229,
      host: "0.0.0.0",
    });
    fastify.log.info(`NIAOU`);
    fastify.log.info(`Server running at http://0.0.0.0:9229`);
    fastify.log.info(`Core endpoint: http://localhost:9229/graphql`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
