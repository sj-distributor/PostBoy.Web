import Home from "../pages/home";
import Enterprise from "../pages/enterprise";
import { RouteItem } from "../dtos/routeType";
import "../fonts/iconfont/iconfont.css";

export const routerArray: RouteItem[] = [
  {
    path: "/home",
    head: "信息发送",
    icons: "iconfont iconmdi_view-dashboard",
    element: <Home />,
    children: [
      {
        path: "/home/enterprise",
        title: "企业微信",
        elementChild: <Enterprise />,
      },
    ],
  },
  {
    path: "/home2.0",
    head: "信息发送2",
    icons: "iconfont iconmdi_view-dashboard",
    element: <Home />,
  },
];
