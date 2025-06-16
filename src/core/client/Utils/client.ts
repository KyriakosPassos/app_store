import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  DocumentNode,
  NormalizedCacheObject,
  ServerError,
} from "@apollo/client";
import { print } from "graphql";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import SHA256 from "crypto-js/sha256";
import { Lru_Cache } from "./LRUCache";
import { onError } from "@apollo/client/link/error";
import { NetworkError } from "@apollo/client/errors";
import { notification } from "antd";

const isServerError = (element: NetworkError): element is ServerError => {
  return element!.name === "ServerError";
};

const isNotAuthenticated = (el: ServerError) => {
  const values = typeof el.result === "string" ? [] : Object.values(el.result);
  return (
    values.some((value) => value === "Not authenticated") ||
    el.result === "Not authenticated"
  );
};

export class ApolloClientFactory {
  private static instance: ApolloClientFactory;

  private clientCache: Lru_Cache<string, ApolloClient<NormalizedCacheObject>>;

  private constructor(maxCacheSize: number = 20) {
    this.clientCache = new Lru_Cache<
      string,
      ApolloClient<NormalizedCacheObject>
    >(maxCacheSize);
  }

  private generateHash(query: DocumentNode): string {
    return SHA256(print(query)).toString();
  }

  public static getInstance(maxCacheSize?: number): ApolloClientFactory {
    if (!ApolloClientFactory.instance) {
      ApolloClientFactory.instance = new ApolloClientFactory(maxCacheSize);
    }
    return ApolloClientFactory.instance;
  }

  private createApolloClient(
    appName?: string
  ): ApolloClient<NormalizedCacheObject> {
    // Determine the GraphQL endpoint based on the appName.
    // If appName is provided, use `/graphql/{appName}`, otherwise use the core endpoint.
    const uri = appName
      ? `http://localhost:9229/graphql/${appName.toLocaleLowerCase()}`
      : "http://localhost:9229/graphql";

    // Create an HttpLink that points to your GraphQL endpoint.
    const httpLink = new HttpLink({ uri, credentials: "include" });

    // Create a persisted queries link.
    // This link sends the hash of the query first and falls back to sending the full query if needed.
    const persistedQueriesLink = createPersistedQueryLink({
      generateHash: this.generateHash,
      useGETForHashedQueries: true,
    });

    // Log any GraphQL errors, protocol errors, or network error that occurred
    const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
      const op = operation.operationName;
      if (op === "getCurrentUser") return;
      const result = networkError;
      if (result && isServerError(result) && isNotAuthenticated(result)) {
        window.location.href = "/login";
      }
      if (graphQLErrors) {
        graphQLErrors.forEach((err) => {
          notification.error({
            message: "[GraphQL error]",
            description: err.message,
            placement: "topRight",
          });
        });
      }
    });
    const client = new ApolloClient({
      link: from([errorLink, persistedQueriesLink, httpLink]),
      // Configure the cache to not add __typename to your queries automatically.
      cache: new InMemoryCache({
        addTypename: false,
      }),
    });

    return client;
  }

  public getClient(appName?: string): ApolloClient<NormalizedCacheObject> {
    const key = appName ? appName.toLocaleLowerCase() : "core";
    let client = this.clientCache.get(key);
    if (!client) {
      client = this.createApolloClient(appName);
      this.clientCache.set(key, client);
    }
    return client;
  }
}
