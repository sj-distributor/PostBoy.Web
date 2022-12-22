import { Navigate, Route, Routes } from "react-router-dom";
import { routerArray } from "./router/elementRoute";
import Login from "./pages/login";
import Main from "./pages/main";

const getSubRoute = () => {
  return (
    <>
      {routerArray.map((item, index) => {
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
                  element={childrenItem.element}
                />
              );
            })}
          </Route>
        );
      })}
    </>
  );
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Main />}>{getSubRoute()}</Route>
      </Routes>
    </div>
  );
}

export default App;
