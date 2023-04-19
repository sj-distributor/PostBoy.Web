import Home from "../pages/home";
import Enterprise from "../pages/enterprise";
import SendEmail from "../pages/email";
import Manager from "../pages/app-manager";
import User from "../pages/user";
import { RouteItem } from "../dtos/route-type";
import "../fonts/iconfont/iconfont.css";
import MeetingSettings from "../pages/meeting-settings";

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
      {
        path: "/home/email",
        title: "邮件发送",
        elementChild: <SendEmail />,
      },
    ],
  },
  {
    path: "/user",
    head: "用户管理",
    icons: "iconfont iconic_account_circle_24px",
    element: <User />,
  },
  {
    path: "/manager",
    head: "应用管理",
    icons: "iconfont iconic_settings_24px",
    element: <Manager />,
  },
  {
    path: "/meetingSettings",
    head: "会议设置",
    icons: "iconfont iconemail",
    element: <MeetingSettings />,
  },
];
