import { useEffect, useState } from "react";
import { Navigate, Route } from "react-router-dom";
import { InitialAppSetting } from "./appsettings";
import { RouteItem } from "./dtos/route-type";

const useAction = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const getSubRoute = (list: RouteItem[]) => {
    return (
      <>
        {list.map((item, index) => {
          return (
            <Route key={index} path={item.path} element={item.element}>
              {item.path === "/home" && (
                <Route path="" element={<Navigate to="/home/enterprise" />} />
              )}
              {item.children?.map((childrenItem, childrenIndex) => {
                return (
                  <Route
                    key={childrenIndex}
                    path={childrenItem.path}
                    element={childrenItem.elementChild}
                  />
                );
              })}
            </Route>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    InitialAppSetting().then(() => setIsLoaded(true));
  }, []);

  return {
    isLoaded,
    getSubRoute
  };
};

export default useAction;
