import { ReactElement } from "react";

export interface IRouteItem {
  path: string;
  head: string;
  icons: string;
  element: ReactElement;
  children?: IChildProps[];
}

export interface IChildProps {
  path: string;
  title: string;
  elementChild: ReactElement;
}
