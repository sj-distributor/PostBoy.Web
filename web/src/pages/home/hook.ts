import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routerArray } from "../../router/elementRoute";

const useAction = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setClickIndex(
      routerArray
        .find((x) => x.path === "/home")
        ?.children?.findIndex((x) => x.path === location.pathname)
    );
  }, []);

  const [clickIndex, setClickIndex] = useState<number>();

  return {
    clickIndex,
    setClickIndex,
    navigate,
    location,
  };
};

export default useAction;
