import { gql, useQuery } from "@apollo/client";

const getFromApp1 = gql`
  query getFromApp1 {
    getFromApp1
  }
`;

const getWithArgumentsFromApp1 = gql`
  query getWithArgumentsFromApp1($text: String!) {
    getWithArgumentsFromApp1(text: $text)
  }
`;

const App1HomePage = () => {
  const { data } = useQuery(getFromApp1);
  const { data: otherData, refetch } = useQuery(getWithArgumentsFromApp1, {
    variables: { text: "geia" },
  });

  return (
    <>
      GEIA SO KOKLE
      <button onClick={() => refetch()}>test</button>
    </>
  );
};

export default App1HomePage;
