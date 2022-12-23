import { ReactElement } from "react";

export interface RoutePrperty {
  path: string;
  head: string;
  element: ReactElement;
  children: RoutePrpertyChild[];
}

export interface RoutePrpertyChild {
  path: string;
  title: string;
  elementChild: ReactElement;
}
