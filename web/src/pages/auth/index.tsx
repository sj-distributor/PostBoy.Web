import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../auth";

const IsAuthUser = (props: { children: JSX.Element }) => {
  let { authStatus } = useAuth();

  let location = useLocation();

  if (!authStatus) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />;
  }

  return props.children;
};

export default IsAuthUser;
