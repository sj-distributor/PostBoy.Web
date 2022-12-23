import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Link, Outlet, useLocation } from "react-router-dom";
import { routerArray } from "../../router/elementRoute";
import { RouteItem } from "../../dtos/routeType";
import useMainAction from "./hook";

const Main = () => {
  const { clickIndex, setClickIndex, location } = useMainAction();

  useEffect(() => {
    setClickIndex(routerArray.findIndex((x) => x.path === location.pathname));
  }, []);

  const routerTabBar = (list: RouteItem[]) => {
    return routerArray.map((item, index) => {
      return (
        <div key={index} className={styles.navBar}>
          <Link
            to={item.path}
            onClick={() => {
              setClickIndex(index);
            }}
            className={
              clickIndex === index ? styles.navBarItemClick : styles.navBarItem
            }
          >
            {item.head}
          </Link>
        </div>
      );
    });
  };

  return (
    <div className={styles.mainBox}>
      <div className={styles.nav}>{routerTabBar(routerArray)}</div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
