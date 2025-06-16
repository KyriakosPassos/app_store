import { AppStructure } from "@core/shared/types";
import { useNavigate } from "react-router-dom";
import "./AppsButtons.css";

// A component that renders the app buttons and handles navigation
const AppsButtons = ({ apps }: { apps: Map<string, AppStructure> }) => {
  const navigate = useNavigate();

  return (
    <>
      {Array.from(apps.values()).map((app) => {
        //App pages are already sorted
        const route = app.pages[0].route;
        return (
          <div
            key={`${app.app}-container`}
            className="AppIconContainer"
            onClick={() => {
              if (route) navigate(`/${app.app}/${route}`);
            }}
          >
            <div className="AppIconWrapper">
              <app.appIcon
                key={app.app}
                style={{
                  width: "50px",
                  height: "auto",
                }}
              />
              {app.app}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default AppsButtons;
