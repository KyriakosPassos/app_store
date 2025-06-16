import { createRoot } from "react-dom/client";
import "@ant-design/v5-patch-for-react-19";
import { notification } from "antd";
import App from "./App";
import "./App.css";

const container = document.getElementById("root");
if (!container) {
  console.log("WHAT");
  throw new Error("WHAT?");
}

notification.config({
  showProgress: true,
  //@ts-ignore
  className: "small-notification",
  style: { maxWidth: "300px" },
});

const root = createRoot(container);

root.render(<App />);
