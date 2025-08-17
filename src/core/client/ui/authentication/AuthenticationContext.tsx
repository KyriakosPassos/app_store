// src/contexts/AuthContext.tsx
import { createContext, useContext, ReactNode } from "react";
import AppApolloWrapper from "../../Utils/apolloWrapper";
import useGetCurrentUserQuery from "core/client/graphql/queries/getCurrentUserQuery";
import {
  useLoginUserMutation,
  useLogoutUserMutation,
} from "core/client/graphql/mutations/authMutations";

interface LdapUser {
  firstName: string;
  lastName: string;
  sAMAccountName: string;
  email?: string;
}

interface LoginResult {
  success: boolean;
  reason: string;
}

interface AuthContextType {
  user: LdapUser | null;
  loginUserLoading: boolean;
  signin: (firstName: string, lastName: string) => Promise<LoginResult>;
  signout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProviderMain = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    loading,
    refetch: getCurrentUser,
  } = useGetCurrentUserQuery({
    fetchPolicy: "cache-first",
  });
  const [loginUser, { loading: loginUserLoading }] = useLoginUserMutation();

  // logout mutation
  const [logoutUser] = useLogoutUserMutation();
  if (loading) return <>Fetching user</>;
  const signin = async (
    firstName: string,
    lastName: string
  ): Promise<LoginResult> => {
    const result = await loginUser({ variables: { firstName, lastName } });
    if (result.data?.loginUser.success) {
      await getCurrentUser();
    }
    return result.data?.loginUser!;
  };

  const signout = async () => {
    await logoutUser();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user: user ?? null, loginUserLoading, signin, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({
  children,
  appName,
}: {
  children: ReactNode;
  appName?: string;
}) => (
  <AppApolloWrapper appName={appName}>
    <AuthProviderMain>{children}</AuthProviderMain>
  </AppApolloWrapper>
);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
