import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RouteState } from "../../dtos/route-index";
import { RouteItem } from "../../dtos/route-type";
import { routerArray } from "../../router/elementRoute";

const useAction = () => {
  const homeLocation = useLocation();
  const homeNavigate = useNavigate();
  const [homeClickIndex, setHomeClickIndex] = useState<number>();

  useEffect(() => {
    console.log(homeLocation.pathname);
    setHomeClickIndex(
      routerArray
        .find((x) => x.path === "/home")
        ?.children?.findIndex((x) => x.path === homeLocation.pathname)
    );
  }, [homeLocation.pathname]);

  return {
    homeClickIndex,
    setHomeClickIndex,
    homeNavigate,
    homeLocation,
  };
};

export default useAction;
