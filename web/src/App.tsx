import { Route, Routes, Navigate } from "react-router-dom";
import { routerArray } from "./router/elementRoute";
import Login from "./pages/login";
import Main from "./pages/main";
import useAction from "./AppHook";
import { RouteItem } from "./dtos/route";
import IsAuthUser from "./pages/auth";

const App = () => {
  const { isLoaded } = useAction();

  const getSubRoute = (list: RouteItem[]) => {
    return list.map((item, index) => {
      return (
        <Route
          key={index}
          path={item.path}
          element={<IsAuthUser>{item.element}</IsAuthUser>}
        >
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
    });
  };

  return (
    <>
      {isLoaded && (
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Main />}>
              {/* <Route path="" element={<Navigate to={"/home"} />} /> */}
              <Route path="" element={<Navigate to={"/none"} />} />
              {getSubRoute(routerArray.filter((item) => item.path !== "/home"))}
            </Route>
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
