import { useContext } from "react";
import { AuthContext } from "../hooks/authProvider";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
