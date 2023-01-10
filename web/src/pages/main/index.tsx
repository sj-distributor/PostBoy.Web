import React from "react";
import styles from "./index.module.scss";
import { Link, Outlet } from "react-router-dom";
import { routerArray } from "../../router/elementRoute";
import { RouteItem } from "../../dtos/route-type";
import useMainAction from "./hook";

const Main = () => {
  const { clickMainIndex, setMainClickIndex } = useMainAction();

  const routerTabBar = (list: RouteItem[]) => {
    return routerArray.map((item, index) => {
      return (
        <div key={index} className={styles.item}>
          <Link
            to={item.path}
            onClick={() => {
              setMainClickIndex(index);
            }}
            className={
              clickMainIndex === index ? styles.itemClick : styles.itemNone
            }
          >
            <span className={item.icons} />
            {item.head}
          </Link>
        </div>
      );
    });
  };

  return (
    <div className={styles.main}>
      <div className={styles.sideBar}>
        <div className={styles.navBar}>{routerTabBar(routerArray)}</div>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
