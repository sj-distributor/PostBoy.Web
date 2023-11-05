import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

interface AuthContextOptions {
  token: string;
  username: string;
  authStatus: boolean;
  signIn: (token: string, callback?: Function) => void;
  signOut: (callback?: Function) => void;
  // 需要补当前账号的角色权限数组
}

interface IRolePermission {
  role: IRole;
  permissions: IPermissionItem[];
}

export interface IRole {
  id: string;
  name: string;
  description: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface IPermissionItem {
  id: string;
  name: string;
  description: string;
  createdDate?: string;
  lastModifiedDate?: string;
  isSystem: boolean;
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

  // 当前账号的角色权限数组
  const [currentUserRolePermissions, setCurrentUserRolePermissions] = useState<
    IRolePermission[]
  >([]);

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
    callback && callback();
  };

  useEffect(() => {
    // 获取当前登陆账号的角色权限
    // setCurrentUserRolePermissions([])
  }, []);

  return (
    <AuthContext.Provider
      value={{ username, token, authStatus, signIn, signOut }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
