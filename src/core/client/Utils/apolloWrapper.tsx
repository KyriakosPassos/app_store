import React from "react";
import { ApolloProvider } from "@apollo/client";
import { ApolloClientFactory } from "./client";

interface AppApolloWrapperProps {
  children: React.ReactNode;
  appName?: string;
}

const AppApolloWrapper = (props: AppApolloWrapperProps) => {
  // Create a client specific for this app using cache in case it was already created previously
  const client = React.useMemo(() => {
    const clientFactory = ApolloClientFactory.getInstance();
    return clientFactory.getClient(props.appName);
  }, [props.appName]);

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};

export default AppApolloWrapper;
