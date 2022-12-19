import React from "react";
import logo from "./logo.svg";

import styles from "./App.module.scss";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import { routerArray } from "./router/elementRoute";

function App() {
  const routerTabBar = () => {
    return routerArray.map((item, index) => {
      return (
        <div className={styles.navBar} key={index}>
          <Link to={item.path}>{item.title}</Link>
        </div>
      );
    });
  };

  return (
    <div className={styles.App}>
      <div className={styles.nav}>{routerTabBar()}</div>
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          {routerArray.map((item, index) => (
            <Route key={index} path={item.path} element={item.element} />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default App;
