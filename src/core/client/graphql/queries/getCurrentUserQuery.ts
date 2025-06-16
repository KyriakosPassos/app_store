import { gql, QueryHookOptions, useQuery } from "@apollo/client";

const GET_CURRENT_USER = gql`
  query getCurrentUser {
    getCurrentUser {
      firstName
      lastName
      sAMAccountName
      email
    }
  }
`;

interface GetCurrentUserResponse {
  firstName: string;
  lastName: string;
  sAMAccountName: string;
  email: string;
}

interface GetCurrentUserVariables {}

const useGetCurrentUserQuery = (
  options?: QueryHookOptions<GetCurrentUserResponse, GetCurrentUserVariables>
) => {
  return useQuery<GetCurrentUserResponse, GetCurrentUserVariables>(
    GET_CURRENT_USER,
    options
  );
};

export default useGetCurrentUserQuery;
