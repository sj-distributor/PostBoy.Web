import Home from "../pages/home";
import Enterprise from "../pages/enterprise";
import { RouteItem } from "../dtos/route-type";
import "../fonts/iconfont/iconfont.css";
import User from "../pages/user";

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
  {
    path: "/user",
    head: "用户管理",
    icons: "iconfont iconic_account_circle_24px",
    element: <User />,
  },
];
