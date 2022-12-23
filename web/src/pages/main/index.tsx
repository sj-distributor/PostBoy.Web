import React, { useState } from "react";
import styles from "./index.module.scss";
import { Link, Outlet } from "react-router-dom";
import { routerArray } from "../../router/elementRoute";
import { RoutePrperty } from "../../assets/routeType";

const Main = () => {
  const routerTabBar = (list: RoutePrperty[]) => {
    return routerArray.map((item, index) => {
      return (
        <div key={index} className={styles.navBar}>
          <Link to={item.path}>{item.head}</Link>
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
