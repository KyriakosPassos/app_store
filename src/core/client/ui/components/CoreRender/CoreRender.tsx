import { gql, useQuery } from "@apollo/client";
import React from "react";

const someCoreResolver = gql`
  query someCoreResolver {
    someCoreResolver
  }
`;

const CoreRender = () => {
  const { data } = useQuery(someCoreResolver);
  if (data) console.log(data);

  return <h1>Testing core.</h1>;
};

export default React.memo(CoreRender);
