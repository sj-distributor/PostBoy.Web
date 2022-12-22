import React, { useState } from "react";
import styles from "./index.module.scss";
import { Link, Outlet } from "react-router-dom";
import { routerArray } from "../../router/elementRoute";

const Main = () => {
  const [clickIndex, setClickIndex] = useState(0);

  const routerTabBar = () => {
    return routerArray.map((item, index) => {
      return (
        <div key={index} className={styles.navBar}>
          <Link to={item.path}>{item.title}</Link>
        </div>
      );
    });
  };

  const routerTabBarContent = () => {
    return routerArray.map((item, index) => {
      return (
        <div key={index} className={styles.content}>
          <div className={styles.contentTab}>
            {item.children?.map((childrenItem, childrenIndex) => {
              return (
                <Link
                  key={childrenIndex}
                  to={childrenItem.path}
                  onClick={() => {
                    setClickIndex(childrenIndex);
                  }}
                >
                  <div
                    className={
                      clickIndex === childrenIndex
                        ? styles.contentTabBarShow
                        : styles.contentTabBar
                    }
                  >
                    {childrenItem.title}
                  </div>
                </Link>
              );
            })}
          </div>
          <Outlet />
        </div>
      );
    });
  };

  return (
    <div className={styles.App}>
      <div className={styles.nav}>{routerTabBar()}</div>
      {routerTabBarContent()}
    </div>
  );
};

export default Main;
