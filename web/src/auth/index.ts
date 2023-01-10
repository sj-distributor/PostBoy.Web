import { useContext } from "react";
import { TokenContext } from "../hooks/tokenProvider";

const useAuth = () => {
  return useContext(TokenContext);
};

export default useAuth;
