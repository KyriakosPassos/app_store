import React from "react";
import { AppPagesStructure, AppStructure } from "@core/shared/types";
import { FaHome, FaIndustry, FaHubspot } from "react-icons/fa";

const pages: AppPagesStructure[] = [
  {
    name: "Home Page 2",
    icon: FaHome,
    priority: 0,
    route: "homePage",
    component: React.lazy(() => import("./App2HomePage")),
  },
  {
    name: "Other Page 2",
    icon: FaHubspot,
    priority: 1,
    route: "otherPage",
    component: React.lazy(() => import("./App2OtherPage")),
  },
] as const;

const App: AppStructure = {
  app: "app2",
  appIcon: FaIndustry,
  pages: pages,
} as const;

export default App;
