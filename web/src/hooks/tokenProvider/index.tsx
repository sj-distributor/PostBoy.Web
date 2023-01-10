import { createContext, useState } from "react";
import jwt_decode from "jwt-decode";

interface AuthContextOptions {
  token: string;
  username: string;
  authStatus: boolean;
  signIn: (token: string, callback?: Function) => void;
  signOut: (callback?: Function) => void;
}

export const AuthContext = createContext<AuthContextOptions>(null!);

const AuthProvider = (props: { children: React.ReactNode }) => {
  const defaultToken = localStorage.getItem("token") as string;
  const [username, setUsername] = useState(
    defaultToken ? jwt_decode<{ unique_name: string }>(defaultToken).unique_name : ""
  );
  const [token, setToken] = useState<string>(defaultToken);
  const [authStatus, setAuthStatus] = useState<boolean>(!!token);

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

  return (
    <AuthContext.Provider value={{ username, token, authStatus, signIn, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
