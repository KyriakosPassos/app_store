import { JSX } from "react";
import { IconType } from "react-icons";

export type AppPagesStructure = {
  readonly name: string;
  readonly icon: IconType;
  readonly priority: number;
  readonly route: string;
  readonly component: React.LazyExoticComponent<() => JSX.Element>;
};

export type AppStructure = {
  readonly app: string;
  readonly appIcon: IconType;
  readonly pages: AppPagesStructure[];
};
