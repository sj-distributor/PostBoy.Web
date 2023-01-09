import { useContext } from "react";
import { TokenContext } from "./tokenProvider";

const useAuth = () => {
  return useContext(TokenContext);
};

export default useAuth;
