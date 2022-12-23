import React from "react";
import styles from "./index.module.scss";
import { Link, Outlet } from "react-router-dom";
import { routerArray } from "../../router/elementRoute";
import { RouteItem } from "../../dtos/routeType";
import useMainAction from "./hook";

const Main = () => {
  const { clickIndex, setClickIndex } = useMainAction();

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
            <span className={item.icons} />
            {item.head}
            {styles.icons}
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
