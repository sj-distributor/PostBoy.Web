import React from "react";
import styles from "./index.module.scss";
import { Link, Outlet } from "react-router-dom";
import { routerArray } from "../../router/elementRoute";
import { RouteItem } from "../../dtos/route-type";
import useMainAction from "./hook";
import UserInformation from "./components/user-information";

const Main = () => {
  const { clickMainIndex, setMainClickIndex } = useMainAction();

  const routerTabBar = (list: RouteItem[]) => {
    return routerArray.map((item, index) => {
      return (
        <div key={index} className={styles.navBarItem}>
          <Link
            to={item.path}
            onClick={() => {
              setMainClickIndex(index);
            }}
            className={clickMainIndex === index ? styles.navBarItemClick : styles.navBarItemNone}
          >
            <span className={item.icons} />
            {item.head}
          </Link>
        </div>
      );
    });
  };

  return (
    <div className={styles.mainBox}>
      <div className={styles.nav}>
        <div className={styles.navBar}>{routerTabBar(routerArray)}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.contextUpper}>
          <UserInformation />
        </div>
        <div className={styles.contextLower}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;
