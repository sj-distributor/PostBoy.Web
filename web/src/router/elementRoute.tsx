import Home from "../pages/home";
import Enterprise from "../pages/enterprise";
import { IRouteItem } from "../dtos/route-type";
import "../fonts/iconfont/iconfont.css";
import Login from "../pages/login";
import User from "../pages/user";

export const routerArray: IRouteItem[] = [
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
      {
        path: "/home/login",
        title: "二级测试",
        elementChild: <Login />,
      },
    ],
  },
  {
    path: "/user",
    head: "用户管理",
    icons: "iconfont iconemail",
    element: <User />,
  },
];
