import React from "react";
import { NavLink } from "react-router-dom";
import { AppStructure } from "../../../../shared/types";
import { FaUndoAlt } from "react-icons/fa";
import AppPageTooltip from "../Utils/AppPageTooltip";
import {
  AiFillCaretRight,
  AiFillCaretLeft,
  AiOutlineLogout,
} from "react-icons/ai";
import "./AppNavBar.css";
import { useAuth } from "../../authentication/AuthenticationContext";

interface NavBarProps {
  app: AppStructure;
}

const AppNavBar = (props: NavBarProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);
  const [currentSelected, setCurrentSelected] = React.useState<string>(
    props.app.pages[0].route
  );
  const { signout } = useAuth();
  const changeMountedAppPageClassName = () => {
    const element = document.getElementById(currentSelected);
    setIsCollapsed((prev) => !prev);
    isCollapsed
      ? element?.classList.replace("AppWrapperCollapsed", "AppWrapperExpanded")
      : element?.classList.replace("AppWrapperExpanded", "AppWrapperCollapsed");
  };
  return (
    <>
      <nav className={`AppNavBar ${isCollapsed ? "collapsed" : "open"}`}>
        {/* <AppPageTooltip title="Collapse">
          <AiFillCaretRight
            className="expand-collapse-icons"
            onClick={changeMountedAppPageClassName}
          />
        </AppPageTooltip> */}
        {props.app.pages.map((page) => (
          <NavLink
            onClick={() => setCurrentSelected(page.route)}
            key={page.route}
            to={`/${props.app.app}/${page.route}`}
            className={`navLinks ${
              currentSelected === page.route ? "selectedNavLink" : ""
            }`}
          >
            <AppPageTooltip title={page.name}>
              <page.icon size={30} className="appIcons" />
            </AppPageTooltip>
          </NavLink>
        ))}
        <NavLink to={`/`} className="navLinks">
          <AppPageTooltip title="App Collection">
            <FaUndoAlt size={30} />
          </AppPageTooltip>
        </NavLink>
        <div
          className="navLinks"
          style={{ marginTop: "auto" }}
          onClick={() => signout()}
        >
          <AppPageTooltip title="Logout">
            <AiOutlineLogout size={30} />
          </AppPageTooltip>
        </div>
      </nav>

      {/* <AppPageTooltip title="Expand">
        <AiFillCaretLeft
          className={`expand-collapse-icons ${
            !isCollapsed ? "hideExpandIcon" : "showExpandIcon"
          }`}
          onClick={changeMountedAppPageClassName}
        />
      </AppPageTooltip> */}
    </>
  );
};

export default AppNavBar;
