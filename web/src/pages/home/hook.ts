import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routerArray } from "../../router/elementRoute";

const useAction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [click, setClick] = useState<number>();

  useEffect(() => {
    setClick(
      routerArray
        .find((x) => x.path === "/home")
        ?.children?.findIndex((x) => x.path === location.pathname)
    );
  }, [location.pathname]);

  return {
    click,
    setClick,
    navigate,
    location,
  };
};

export default useAction;
