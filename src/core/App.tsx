import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppStructure } from "./shared/types";
import CoreHomePage from "./client/ui/pages/CoreHomePage";
import AppLayout from "./client/ui/components/AppLayout.tsx/AppLayout";
import RequireAuth from "./client/ui/authentication/RequireAuth";
import LoginComponent from "./client/ui/components/Login/LoginComponent";
import { AuthProvider } from "./client/ui/authentication/AuthenticationContext";

const App = () => {
  const [apps, setApps] = React.useState<Map<string, AppStructure>>(new Map());

  React.useEffect(() => {
    const getAppsInfo = async (): Promise<AppStructure[]> => {
      // Dynamically import all index files from apps
      const modules = import.meta.glob("../apps/*/client/ui/pages/index.ts");
      const promises = Object.values(modules).map((el) => el()) as Promise<{
        default: AppStructure;
      }>[];
      return await Promise.all(promises).then((res) =>
        res.map((el) => el.default)
      );
    };
    getAppsInfo().then((res) => {
      const appsMap = new Map<string, AppStructure>();
      res.forEach((el) => {
        el.pages.sort((a, b) => a.priority - b.priority);
        appsMap.set(el.app, el);
      });
      setApps(appsMap);
    });
  }, []);

  return (
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading pages...</div>}>
        <Routes>
          {/* public route */}
          <Route
            path="/login"
            element={
              <AuthProvider>
                <LoginComponent />
              </AuthProvider>
            }
          />
          <Route
            path="/"
            element={
              <AuthProvider>
                <RequireAuth>
                  <CoreHomePage apps={apps} key="coreRoute" />
                </RequireAuth>
              </AuthProvider>
            }
          />
          <Route path="/:appId/*" element={<AppLayout apps={apps} />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
