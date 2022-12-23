import Home from "../pages/home";
import Enterprise from "../pages/enterprise";
import { RoutePrperty } from "../dtos/routeType";

export const routerArray: RoutePrperty[] = [
  {
    path: "/home",
    head: "信息发送",
    element: <Home />,
    children: [
      {
        path: "/home/enterprise",
        title: "企业微信",
        elementChild: <Enterprise />,
      },
    ],
  },
];
