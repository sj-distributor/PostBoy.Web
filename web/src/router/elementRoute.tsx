import Home from "../pages/home";
import Enterprise from "../pages/enterprise";
import SendEmail from "../pages/email";
import Manager from "../pages/app-manager";
import User from "../pages/user";
import { RouteItem } from "../dtos/route";
import MeetingList from "../pages/meeting-list";
import { SendRequest } from "../pages/request";

import EmailIcon from "@mui/icons-material/Email";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { RolePermission } from "../pages/role-perimission";
import { UserList } from "../pages/role-perimission/components/user-list";
import { RoleFrom } from "../pages/role-perimission/components/role-from";
import { RolePermissions } from "../pages/role-perimission/components/role-permissions";
import { None } from "../pages/none";
import Login from "../pages/login";
import Main from "../pages/main";
import IsAuthUser from "../pages/auth";
import useAuth from "../auth";
import { useEffect } from "react";
import MeetingWhiteList from "../pages/meeting-white-list";

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
    path: "/role",
    head: "角色权限",
    icons: <PersonOutlineIcon />,
    element: <RolePermission />,
    children: [
      {
        path: "",
        title: "",
        elementChild: <Navigate to={"/role/permission"} />,
      },
      {
        path: "/role/users/:roleId",
        title: "",
        elementChild: <UserList />,
      },
      {
        path: "/role/create",
        title: "",
        elementChild: <RoleFrom />,
      },
      {
        path: "/role/permission",
        title: "",
        elementChild: <RolePermissions />,
      },
      {
        path: "/role/edit/:roleId",
        title: "",
        elementChild: <RoleFrom />,
      },
    ],
  },
  {
    path: "/whiteList",
    head: "会议总结",
    icons: <SettingsIcon />,
    element: <MeetingWhiteList />,
  },
  {
    path: "/none",
    head: "",
    element: <None />,
  },
  {
    path: "/meeting",
    head: "",
    element: <MeetingList />,
  },
  {
    path: "/user",
    head: "",
    // icons: <AccountCircleIcon />,
    element: <User />,
  },
  {
    path: "/manager",
    head: "",
    // icons: <SettingsIcon />,
    element: <Manager />,
  },
];

export const Router = () => {
  const { filterRouter, displayPage, username, token } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (displayPage && displayPage !== "/none" && username) {
      navigate(
        location.pathname.includes(displayPage) || location.pathname === "/none"
          ? displayPage
          : location.pathname,
        { replace: true }
      );
    } else if (!token) {
      navigate("/login", { replace: true });
    }
  }, [displayPage]);

  const getSubRoute = (list: RouteItem[]) => {
    return (
      <>
        <Route path="" element={<Navigate to={list[0].path} />} />
        {list.map((item, index) => {
          return (
            <Route
              key={index}
              path={item.path}
              element={<IsAuthUser>{item.element}</IsAuthUser>}
            >
              {item.children?.map((childrenItem, childrenIndex) => {
                return (
                  <Route
                    key={childrenIndex}
                    path={childrenItem.path}
                    element={childrenItem.elementChild}
                  />
                );
              })}
            </Route>
          );
        })}
      </>
    );
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Main />}>{getSubRoute(filterRouter)}</Route>
    </Routes>
  );
};
