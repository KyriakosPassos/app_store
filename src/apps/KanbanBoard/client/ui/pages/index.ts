import React from "react";
import { AppPagesStructure, AppStructure } from "@core/shared/types";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaHome, FaHourglass, FaHockeyPuck } from "react-icons/fa";

const pages: AppPagesStructure[] = [
  {
    name: "Home Page 1",
    icon: FaHome,
    priority: 0,
    route: "homePage",
    component: React.lazy(() => import("./BoardHomePage")),
  },
  {
    name: "Other Page 1",
    icon: FaHockeyPuck,
    priority: 1,
    route: "otherPage",
    component: React.lazy(() => import("./App1OtherPage")),
  },
];

const App: AppStructure = {
  app: "KanbanBoard",
  appIcon: FaChalkboardTeacher,
  pages: pages,
} as const;

export default App;
