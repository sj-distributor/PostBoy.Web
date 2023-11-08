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
import { IRolePermissionDataItem } from "../dtos/role-user-permissions";

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
  {
    path: "/roles",
    head: "角色权限",
    icons: <PersonOutlineIcon />,
    element: <RolePermission />,
    children: [
      {
        path: "",
        title: "",
        elementChild: <Navigate to={"/roles/roleList"} />,
      },
      {
        path: "/roles/userList/:roleId",
        title: "",
        elementChild: <UserList />,
      },
      {
        path: "/roles/add",
        title: "",
        elementChild: <RoleFrom />,
      },
      {
        path: "/roles/roleList",
        title: "",
        elementChild: <RolePermissions />,
      },
      {
        path: "/roles/edit/:roleId",
        title: "",
        elementChild: <RoleFrom />,
      },
    ],
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
];

export const Router = () => {
  const { filterRouter, displayPage, username } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (displayPage && displayPage !== "/none" && username) {
      navigate(
        location.pathname.includes(displayPage)
          ? displayPage
          : location.pathname,
        { replace: true }
      );
    } else if (!username) {
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
