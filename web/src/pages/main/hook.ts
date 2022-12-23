import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { childrenProps, RouteItem } from "../../dtos/routeType";
import { routerArray } from "../../router/elementRoute";

const useMainAction = () => {
  const location = useLocation();
  const [clickIndex, setClickIndex] = useState<number>(0);

  useEffect(() => {
    console.log(routerArray.findIndex((x) => x.path === location.pathname));
    setClickIndex(
      (routerArray.findIndex((x) => x.path === location.pathname) === -1
        ? routerArray.map((item: RouteItem, index: number) => {
            // return item?.children?.findIndex(
            //   (x) => x.path === location.pathname
            // );
            if (
              item?.children?.findIndex((x) => x.path === location.pathname) !==
              -1
            )
              return index;
          })
        : routerArray.findIndex((x) => x.path === location.pathname)) as number
    );
  }, []);

  return {
    location,
    clickIndex,
    setClickIndex,
  };
};

export default useMainAction;
