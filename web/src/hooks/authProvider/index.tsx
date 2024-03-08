import { createContext, useState, useEffect, useMemo } from "react";

import { GetCurrentRolesByPermissions } from "../../api/role-user-permissions";
import {
  FunctionalPermissionsEnum,
  IRolePermissionDto,
  UserRoleEnum,
} from "../../dtos/role-user-permissions";
import { routerArray } from "../../router/elementRoute";
import { RouteItem } from "../../dtos/route";
import { GetAuthUser } from "../../api/user-management";

interface AuthContextOptions {
  token: string;
  username: string;
  authStatus: boolean;
  currentUserRolePermissions: IRolePermissionDto;
  filterRouter: RouteItem[];
  haveAdminPermission: boolean;
  displayPage: string;
  signIn: (token: string, username: string, callback?: Function) => void;
  signOut: (callback?: Function) => void;
}

export const AuthContext = createContext<AuthContextOptions>(null!);

const AuthProvider = (props: { children: React.ReactNode }) => {
  const defaultToken = localStorage.getItem("token") as string;

  const defaulUserName = localStorage.getItem("username") as string;

  const [username, setUsername] = useState(defaulUserName);
  const [token, setToken] = useState<string>(defaultToken);
  const [authStatus, setAuthStatus] = useState<boolean>(!!defaultToken);

  const [displayPage, setDisplayPage] = useState<string>("");

  const [haveAdminPermission, setHaveAdminPermission] =
    useState<boolean>(false);

  const [currentUserRolePermissions, setCurrentUserRolePermissions] =
    useState<IRolePermissionDto>({
      count: 0,
      rolePermissionData: [],
    });

  const signIn = (token: string, username: string, callback?: Function) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);

    setUsername(username);
    setAuthStatus(true);
    callback && callback();

    getUserRole();
  };

  const signOut = (callback?: Function) => {
    setToken("");
    setUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setAuthStatus(false);
    setCurrentUserRolePermissions({
      count: 0,
      rolePermissionData: [],
    });
    callback && callback();
  };

  const getUserRole = () => {
    GetCurrentRolesByPermissions()
      .then((res) => {
        setCurrentUserRolePermissions({
          count: res?.count ?? 0,
          rolePermissionData: res?.rolePermissionData ?? [],
        });
      })
      .catch(() => {
        setCurrentUserRolePermissions({
          count: 0,
          rolePermissionData: [],
        });
      });
  };

  const filterRouter = useMemo(() => {
    const { rolePermissionData } = currentUserRolePermissions;

    const sendMessagePermission = rolePermissionData.some((item) => {
      return item.permissions.some(
        (permission) =>
          permission.name === FunctionalPermissionsEnum.CanViewSendMessage
      );
    });

    const rolePermission = rolePermissionData.some((item) => {
      return item.permissions.some(
        (permission) =>
          permission.name ===
          FunctionalPermissionsEnum.CanViewSecurityManagement
      );
    });

    const adminPermission = rolePermissionData.some(
      (item) => item.role.name === UserRoleEnum.Administrator
    );

    setHaveAdminPermission(adminPermission);

    setDisplayPage(
      sendMessagePermission
        ? "/home"
        : rolePermission
        ? "/role"
        : adminPermission
        ? "/user"
        : "/none"
    );

    return routerArray.filter(
      (item) =>
        (sendMessagePermission || item.path !== "/home") &&
        (rolePermission || item.path !== "/role") &&
        (adminPermission || (item.path !== "/user" && item.path !== "/manager"))
    );
  }, [currentUserRolePermissions]);

  useEffect(() => {
    if (token) {
      GetAuthUser().then((res) => {
        const { userName } = res;
        if (userName && userName !== username) {
          setUsername(userName);
          localStorage.setItem("username", userName);
        }
      });

      getUserRole();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        username,
        token,
        authStatus,
        signIn,
        signOut,
        currentUserRolePermissions,
        filterRouter,
        haveAdminPermission,
        displayPage,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
