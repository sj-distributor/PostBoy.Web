import { ReactElement } from "react";

export interface RouteItem {
  path: string;
  head: string;
  icons: string;
  element: ReactElement;
  children?: childrenProps[];
}

export interface childrenProps {
  path: string;
  title: string;
  elementChild: ReactElement;
}
