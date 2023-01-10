import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RouteStateEnum } from "../../dtos/route-index";
import { IRouteItem } from "../../dtos/route-type";
import { routerArray } from "../../router/elementRoute";

const useMainAction = () => {
  const mainLocation = useLocation();
  const [clickMainIndex, setMainClickIndex] = useState<number>();

  useEffect(() => {
    const getMainClickIndex = () => {
      const getMainIndex = 0;
      routerArray.map(
        (item: IRouteItem, index: number) =>
          item?.children?.findIndex((x) => x.path === mainLocation.pathname) !==
            RouteStateEnum.None && getMainIndex === index
      );
      return getMainIndex;
    };

    setMainClickIndex(
      (routerArray.findIndex((x) => x.path === mainLocation.pathname) ===
      RouteStateEnum.None
        ? getMainClickIndex()
        : routerArray.findIndex(
            (x) => x.path === mainLocation.pathname
          )) as number
    );
  }, [mainLocation.pathname]);

  return {
    mainLocation,
    clickMainIndex,
    setMainClickIndex,
  };
};

export default useMainAction;
