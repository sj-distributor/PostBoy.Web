import { createContext, useEffect, useMemo, useState } from "react";
import jwt_decode from "jwt-decode";
import { GetRolesByPermissions } from "../../api/role-user-permissions";
import { IRolePermissionDto } from "../../dtos/role-user-permissions";
import { routerArray } from "../../router/elementRoute";
import { RouteItem } from "../../dtos/route";

interface AuthContextOptions {
  token: string;
  username: string;
  authStatus: boolean;
  signIn: (token: string, callback?: Function) => void;
  signOut: (callback?: Function) => void;
  currentUserRolePermissions: IRolePermissionDto;
  filterRouter: RouteItem[];
  haveAdminPermission: boolean;
  displayPage: string;
}

export const AuthContext = createContext<AuthContextOptions>(null!);

const AuthProvider = (props: { children: React.ReactNode }) => {
  const defaultToken = localStorage.getItem("token") as string;
  const [username, setUsername] = useState(
    defaultToken
      ? jwt_decode<{ unique_name: string }>(defaultToken).unique_name
      : ""
  );
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

  const signIn = (token: string, callback?: Function) => {
    setToken(token);
    localStorage.setItem("token", token);
    const tokenObj = jwt_decode<{ unique_name: string }>(token);
    setUsername(tokenObj.unique_name);
    setAuthStatus(true);
    callback && callback();
  };

  const signOut = (callback?: Function) => {
    setToken("");
    setUsername("");
    localStorage.setItem("token", "");
    setAuthStatus(false);
    setDisplayPage("/none");
    callback && callback();
  };

  const filterRouter = useMemo(() => {
    const { rolePermissionData } = currentUserRolePermissions;

    const sendMessagePermission = rolePermissionData.some((item) => {
      return item.permissions.some(
        (permission) => permission.displayName === "信息發送"
      );
    });

    const rolePermission = rolePermissionData.some((item) => {
      return item.permissions.some(
        (permission) => permission.displayName === "角色權限"
      );
    });

    const adminPermission = rolePermissionData.some(
      (item) => item.role.name === "Administrator"
    );

    setHaveAdminPermission(adminPermission);

    setDisplayPage(
      sendMessagePermission
        ? "/home"
        : rolePermission
        ? "/roles"
        : adminPermission
        ? "/user"
        : "/none"
    );

    return routerArray.filter(
      (item) =>
        (sendMessagePermission || item.path !== "/home") &&
        (rolePermission || item.path !== "/roles") &&
        (adminPermission || (item.path !== "/user" && item.path !== "/manager"))
    );
  }, [currentUserRolePermissions]);

  useEffect(() => {
    if (username)
      GetRolesByPermissions({
        pageIndex: 0,
        pageSize: 0,
      })
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
  }, [username]);

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
