import { useBoolean } from "ahooks";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GetAuthUser } from "../../api/user-management";
import { RouteItem } from "../../dtos/route-type";
import { IUserResponse } from "../../dtos/user-management";
import { routerArray } from "../../router/elementRoute";

enum RouteState {
  None = -1,
}

const useMainAction = () => {
  const mainLocation = useLocation();
  const [clickMainIndex, setMainClickIndex] = useState<number>();
  const [haveAdministrator, haveAdministratorAction] = useBoolean(false);
  const [userData, setUserData] = useState<IUserResponse>();

  useEffect(() => {
    const getMainClickIndex = () => {
      const getMainIndex = 0;
      routerArray.map(
        (item: RouteItem, index: number) =>
          item?.children?.findIndex((x) => x.path === mainLocation.pathname) !==
            RouteState.None && getMainIndex === index
      );
      return getMainIndex;
    };

    setMainClickIndex(
      (routerArray.findIndex((x) => x.path === mainLocation.pathname) ===
      RouteState.None
        ? getMainClickIndex()
        : routerArray.findIndex(
            (x) => x.path === mainLocation.pathname
          )) as number
    );
  }, [mainLocation.pathname]);

  useEffect(() => {
    GetAuthUser().then((res) => {
      if (!!res) {
        setUserData(res);
      }
      if (res?.roles?.find((x) => x.name === "Administrator")) {
        haveAdministratorAction.setTrue();
      }
    });
  }, []);

  return {
    mainLocation,
    clickMainIndex,
    setMainClickIndex,
    haveAdministrator,
  };
};

export default useMainAction;
