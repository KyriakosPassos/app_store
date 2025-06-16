import AppApolloWrapper from "../../Utils/apolloWrapper";
import { AppStructure } from "@core/shared/types";
import AppsButtons from "../components/AppsButtons/AppsButtons";
import CoreRender from "../components/CoreRender/CoreRender";

interface IProps {
  apps: Map<string, AppStructure>;
}

const CoreHomePage = (props: IProps) => {
  if (!props.apps.size) return <div>Loading apps...</div>;

  return (
    <AppApolloWrapper>
      <div style={{ padding: "1rem" }}>
        <CoreRender />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <AppsButtons apps={props.apps} />
        </div>
      </div>
    </AppApolloWrapper>
  );
};

export default CoreHomePage;
