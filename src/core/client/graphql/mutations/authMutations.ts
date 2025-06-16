import { gql, MutationHookOptions, useMutation } from "@apollo/client";

const LOGIN_USER = gql`
  mutation loginUser($firstName: String!, $lastName: String!) {
    loginUser(firstName: $firstName, lastName: $lastName) {
      success
      reason
    }
  }
`;

interface LoginUserVariables {
  firstName: string;
  lastName: string;
}

interface LoginUser {
  success: boolean;
  reason: string;
}

interface LoginUserResponse {
  loginUser: LoginUser;
}

export const useLoginUserMutation = (
  options?: MutationHookOptions<LoginUserResponse, LoginUserVariables>
) => {
  return useMutation<LoginUserResponse, LoginUserVariables>(
    LOGIN_USER,
    options
  );
};

const LOGOUT = gql`
  mutation logoutUser {
    logoutUser
  }
`;

interface LogoutUserResponse {
  logoutUser: boolean;
}

interface LogoutUserVariables {}

export const useLogoutUserMutation = (
  options?: MutationHookOptions<LogoutUserResponse, LogoutUserVariables>
) => {
  return useMutation<LogoutUserResponse, LogoutUserVariables>(LOGOUT, options);
};
