import { Router } from "./router/elementRoute";
import useAction from "./AppHook";
import TokenProvider from "./hooks/authProvider";

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
