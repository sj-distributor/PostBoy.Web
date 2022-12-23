import { Navigate, Route, Routes } from "react-router-dom";
import { routerArray } from "./router/elementRoute";
import Login from "./pages/login";
import Main from "./pages/main";
import { RouteItem } from "./dtos/routeType";

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

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Main />}>{getSubRoute(routerArray)}</Route>
      </Routes>
    </div>
  );
};

export default App;
