import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routerArray } from "../../router/elementRoute";

const useMainAction = () => {
  const location = useLocation();
  const [clickIndex, setClickIndex] = useState<number>(0);

  useEffect(() => {
    setClickIndex(routerArray.findIndex((x) => x.path === location.pathname));
  }, []);

  return {
    location,
    clickIndex,
    setClickIndex,
  };
};

export default useMainAction;
