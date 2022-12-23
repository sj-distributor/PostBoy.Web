import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RouteState } from "../../dtos/route-index";
import { childrenProps, RouteItem } from "../../dtos/route-type";
import { routerArray } from "../../router/elementRoute";

const useMainAction = () => {
  const mainLocation = useLocation();
  const [clickMainIndex, setMainClickIndex] = useState<number>();

  useEffect(() => {
    const getMainClickIndex = () => {
      const getMainSubscript = 0;
      routerArray.map(
        (item: RouteItem, index: number) =>
          item?.children?.findIndex((x) => x.path === mainLocation.pathname) !==
            RouteState.None && getMainSubscript === index
      );
      return getMainSubscript;
    };

    setMainClickIndex(
      (routerArray.findIndex((x) => x.path === mainLocation.pathname) ===
      RouteState.None // 当前路由下标为-1时
        ? getMainClickIndex()
        : routerArray.findIndex(
            (x) => x.path === mainLocation.pathname
          )) as number // 当前路由下标不是-1 返回路由数组下标 as number 转为number类型 // 1
    );
  }, []);

  return {
    mainLocation,
    clickMainIndex,
    setMainClickIndex,
  };
};

export default useMainAction;
