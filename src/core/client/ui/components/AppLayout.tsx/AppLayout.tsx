import React from "react";
import { Route, Routes, useParams } from "react-router-dom";
import AppNavBar from "../AppNavBar/AppNavBar";
import { AppStructure } from "../../../../shared/types";
import "./AppLayout.css";
import { AuthProvider } from "../../authentication/AuthenticationContext";
import AppApolloWrapper from "core/client/Utils/apolloWrapper";

interface AppLayoutProps {
  apps: Map<string, AppStructure>;
}

const AppLayout: React.FC<AppLayoutProps> = ({ apps }) => {
  const { appId } = useParams();
  const currentApp = apps.get(appId!);

  const pagesRoutes = React.useMemo(() => {
    return currentApp?.pages.map((page) => (
      <Route
        key={`/${page.route}`}
        path={`/${page.route}/*`}
        element={
          <div id={page.route} key={page.route} className="AppWrapper">
            <page.component />
          </div>
        }
      />
    ));
  }, [currentApp]);

  if (!currentApp) return <div>App not found.</div>;

  return (
    <>
      <AuthProvider>
        <AppNavBar app={currentApp} />
      </AuthProvider>
      <AuthProvider appName={currentApp.app}>
        <Routes>{pagesRoutes}</Routes>
      </AuthProvider>
    </>
  );
};

export default AppLayout;
