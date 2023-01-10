import { useEffect, useState } from "react";
import { InitialAppSetting } from "./appsettings";

const useAction = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    InitialAppSetting().then(() => setIsLoaded(true));
  }, []);

  return {
    isLoaded
  };
};

export default useAction;
