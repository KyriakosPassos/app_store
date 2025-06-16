import React from "react";
import { Route, Routes, useParams } from "react-router-dom";
import AppNavBar from "../AppNavBar/AppNavBar";
import { AppStructure } from "../../../../shared/types";
import AppApolloWrapper from "../../../Utils/apolloWrapper";
import "./AppLayout.css";

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
        path={`/${page.route}`}
        element={
          <div id={page.route} key={page.route} className="AppWrapperExpanded">
            <page.component />
          </div>
        }
      />
    ));
  }, [currentApp]);

  if (!currentApp) return <div>App not found.</div>;

  return (
    <AppApolloWrapper appName={currentApp.app}>
      <AppNavBar app={currentApp} />
      <Routes>{pagesRoutes}</Routes>
    </AppApolloWrapper>
  );
};

export default AppLayout;
