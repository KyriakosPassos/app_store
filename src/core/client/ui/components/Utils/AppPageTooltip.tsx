import { Tooltip } from "antd";
import { JSX } from "react";

interface IProps {
  title: string;
  children: JSX.Element;
}

const AppPageTooltip = (props: IProps) => {
  return (
    <Tooltip
      title={props.title}
      arrow={false}
      placement="right"
      styles={{
        body: { fontSize: "1rem", padding: "2px", minHeight: "5px" },
      }}
    >
      {props.children}
    </Tooltip>
  );
};

export default AppPageTooltip;
