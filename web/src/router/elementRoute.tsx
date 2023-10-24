import Home from "../pages/home";
import Enterprise from "../pages/enterprise";
import SendEmail from "../pages/email";
import Manager from "../pages/app-manager";
import User from "../pages/user";
import { RouteItem } from "../dtos/route";
import MeetingList from "../pages/meeting-list";
import { SendRequest } from "../pages/request";

import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { RolePermission } from "../pages/role-perimission";
import { RoleFrom } from "../pages/role-perimission/components/role-from";
import { UserList } from "../pages/role-perimission/components/user-list";
import { RolePermissions } from "../pages/role-perimission/components/role-permissions";
import { Navigate } from "react-router-dom";

export const routerArray: RouteItem[] = [
  {
    path: "/home",
    head: "信息发送",
    icons: <EmailIcon />,
    element: <Home />,
    children: [
      {
        path: "",
        title: "",
        elementChild: <Navigate to="/home/enterprise" />,
      },
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
      {
        path: "/home/request",
        title: "请求发送",
        elementChild: <SendRequest />,
      },
    ],
  },
  {
    path: "/user",
    head: "用户管理",
    icons: <AccountCircleIcon />,
    element: <User />,
  },
  {
    path: "/manager",
    head: "应用管理",
    icons: <SettingsIcon />,
    element: <Manager />,
  },
  // {
  //   path: "/roles",
  //   head: "角色权限",
  //   icons: <PersonOutlineIcon />,
  //   element: <RolePermission />,
  //   children: [
  //     {
  //       path: "",
  //       title: "",
  //       elementChild: <Navigate to={"/roles/roleList"} />,
  //     },
  //     {
  //       path: "/roles/userList",
  //       title: "",
  //       elementChild: <UserList />,
  //     },
  //     {
  //       path: "/roles/add",
  //       title: "",
  //       elementChild: <RoleFrom />,
  //     },
  //     {
  //       path: "/roles/edit/:id",
  //       title: "",
  //       elementChild: <RoleFrom />,
  //     },
  //     {
  //       path: "/roles/roleList",
  //       title: "",
  //       elementChild: <RolePermissions />,
  //     },
  //   ],
  // },
  {
    path: "/meeting",
    head: "",
    element: <MeetingList />,
  },
];
