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
    const getHomeClickIndex = () => {
      const getHomeSubscript = 0;
      routerArray.map(
        (item: RouteItem, index: number) =>
          item?.children?.findIndex((x) => x.path === homeLocation.pathname) !==
            RouteState.None && getHomeSubscript === index
      );
      return getHomeSubscript;
    };
    setHomeClickIndex(
      (routerArray.findIndex((x) => x.path === homeLocation.pathname) ===
      RouteState.None
        ? getHomeClickIndex()
        : routerArray.findIndex(
            (x) => x.path === homeLocation.pathname
          )) as number
    );
  }, []);

  return {
    homeClickIndex,
    setHomeClickIndex,
    homeNavigate,
    homeLocation,
  };
};

export default useAction;
