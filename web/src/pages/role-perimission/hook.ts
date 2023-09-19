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
        .find((x) => x.path === "/roles")
        ?.children?.findIndex((x) => x.path === location.pathname)
    );
  }, [location.pathname]);

  console.log(click);

  return {
    click,
    setClick,
    navigate,
    location,
  };
};

export default useAction;
