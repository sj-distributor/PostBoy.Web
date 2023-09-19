import { useBoolean } from "ahooks";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GetAuthUser } from "../../api/user-management";
import { IUserResponse } from "../../dtos/user-management";
import { routerArray } from "../../router/elementRoute";

const useMainAction = () => {
  const mainLocation = useLocation();

  const [clickMainIndex, setMainClickIndex] = useState<number>();

  const [haveAdministrator, haveAdministratorAction] = useBoolean(false);

  const [userData, setUserData] = useState<IUserResponse>();

  useEffect(() => {
    const getMainClickIndex = () => {
      const getMainIndex = routerArray.findIndex((item) =>
        item?.children?.some((x) => x.path === mainLocation.pathname)
      );
      return getMainIndex >= 0 ? getMainIndex : 0;
    };

    setMainClickIndex(
      routerArray.findIndex((item) => item.path === mainLocation.pathname) >= 0
        ? routerArray.findIndex((item) => item.path === mainLocation.pathname)
        : getMainClickIndex()
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
