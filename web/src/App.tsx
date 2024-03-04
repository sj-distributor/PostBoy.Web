import { Router } from "./router/elementRoute";
import TokenProvider from "./hooks/authProvider";
import useAction from "./AppHook";

const App = () => {
  const { isLoaded } = useAction();

  return (
    <>
      {isLoaded && (
        <TokenProvider>
          <div className="App">
            <Router />
          </div>
        </TokenProvider>
      )}
    </>
  );
};

export default App;
