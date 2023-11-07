import { useEffect, useState } from "react";
import { AuthAccont } from "../../api/login";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../auth";

const useAction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const { authStatus, signIn, displayPage } = useAuth();

  const handleLoginButton = async () => {
    const data = await AuthAccont({ userName: username, password });
    !!data ? signIn(data, () => navigateTo("current")) : setOpenSnackBar(true);
  };

  const navigateTo = (scenes: string) => {
    if (authStatus || localStorage.getItem("token")) {
      switch (scenes) {
        case "current":
          navigate(displayPage, { replace: true });
          break;
        case "history":
          navigate(
            location.state.from.pathname
              ? location.state?.from?.pathname
              : displayPage,
            { replace: true }
          );
          break;
      }
    }
  };

  useEffect(() => {
    navigateTo("history");
  }, []);

  return {
    username,
    password,
    openSnackBar,
    setOpenSnackBar,
    setUsername,
    setPassword,
    handleLoginButton,
  };
};

export default useAction;
