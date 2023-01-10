import { useContext } from "react";
import { AuthContext } from "../hooks/tokenProvider";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
