import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../auth";

const useMainAction = () => {
  const mainLocation = useLocation();

  const [clickMainIndex, setMainClickIndex] = useState<number>();

  const { filterRouter } = useAuth();

  useEffect(() => {
    const currentPath = mainLocation.pathname;

    const indexInRouterArray = filterRouter.findIndex((routeItem) => {
      const currentPathSplit = currentPath.split("/");

      const currentPathFirstPart = currentPathSplit[1];

      return routeItem.path.includes(currentPathFirstPart);
    });

    setMainClickIndex(indexInRouterArray);
  }, [mainLocation.pathname, filterRouter]);

  return {
    mainLocation,
    clickMainIndex,
    setMainClickIndex,
  };
};

export default useMainAction;
