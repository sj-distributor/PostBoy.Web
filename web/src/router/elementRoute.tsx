import Home from "../pages/home";
import Enterprise from "../pages/enterprise";
import { RouteItem } from "../dtos/route-type";
import "../fonts/iconfont/iconfont.css";

export const routerArray: RouteItem[] = [
  {
    path: "/home",
    head: "信息发送",
    icons: "iconfont iconemail",
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
