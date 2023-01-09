import { createContext, useState } from "react";
import jwt_decode from "jwt-decode";

interface TokenContextOptions {
  token: string;
  username: string;
  authStatus: boolean;
  signIn: (token: string, callback: Function) => void;
  signOut: (callback: Function) => void;
}

export const TokenContext = createContext<TokenContextOptions>(null!);

const TokenProvider = (props: { children: React.ReactNode }) => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [authStatus, setAuthStatus] = useState(false);

  const signIn = (token: string, callback: Function) => {
    setToken(token);
    (window as any).token = token;
    const tokenObj = jwt_decode<{ username: string }>(token);
    setUsername(tokenObj.username);
    setAuthStatus(true);
    callback && callback();
  };

  const signOut = (callback: Function) => {
    setToken("");
    setUsername("");
    (window as any).token = "";
    setAuthStatus(false);
    callback && callback();
  };

  return (
    <TokenContext.Provider value={{ username, token, authStatus, signIn, signOut }}>
      {props.children}
    </TokenContext.Provider>
  );
};

export default TokenProvider;
