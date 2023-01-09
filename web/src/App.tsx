import { Route, Routes } from "react-router-dom";
import { routerArray } from "./router/elementRoute";
import Login from "./pages/login";
import Main from "./pages/main";
import useAction from "./AppHook";

const App = () => {
  const { isLoaded, getSubRoute } = useAction();

  return isLoaded ? (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Main />}>{getSubRoute(routerArray)}</Route>
      </Routes>
    </div>
  ) : (
    <></>
  );
};

export default App;
