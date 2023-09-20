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
    const indexInRouterArray = routerArray.findIndex((item) =>
      mainLocation.pathname.includes(item.path)
    );

    setMainClickIndex(indexInRouterArray);
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
