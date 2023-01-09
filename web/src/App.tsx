import { Route, Routes, Navigate } from "react-router-dom";
import { routerArray } from "./router/elementRoute";
import Login from "./pages/login";
import Main from "./pages/main";
import useAction from "./AppHook";
import { RouteItem } from "./dtos/route-type";
import IsAuthUser from "./pages/auth";

const App = () => {
  const { isLoaded } = useAction();

  const getSubRoute = (list: RouteItem[]) => {
    return list.map((item, index) => {
      return (
        <Route key={index} path={item.path} element={item.element}>
          <Route path="" element={<Navigate to="/home/enterprise" />} />

          {item.children?.map((childrenItem, childrenIndex) => {
            return (
              <Route
                key={childrenIndex}
                path={childrenItem.path}
                element={<IsAuthUser>{childrenItem.elementChild}</IsAuthUser>}
              />
            );
          })}
        </Route>
      );
    });
  };
  return isLoaded ? (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Main />}>
          <Route path="" element={<Navigate to={"/home"} />} />
          {getSubRoute(routerArray)}
        </Route>
      </Routes>
    </div>
  ) : (
    <></>
  );
};

export default App;
