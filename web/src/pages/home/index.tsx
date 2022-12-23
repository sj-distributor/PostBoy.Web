import { Outlet, useNavigate } from "react-router-dom";
import { RoutePrperty } from "../../assets/routeType";
import { routerArray } from "../../router/elementRoute";
import useAction from "./hook";

import styles from "./index.module.scss";

const Home = () => {
  const { clickIndex, setClickIndex } = useAction();
  let naviger = useNavigate();

  const routerTabBarContent = (list: RoutePrperty[]) => {
    return list.map((item, index) => {
      return (
        <div key={index} className={styles.content}>
          <div className={styles.contentTab}>
            {item.children?.map((childrenItem, childrenIndex) => {
              return (
                <div
                  key={childrenIndex}
                  onClick={() => {
                    setClickIndex(childrenIndex);
                    {
                      naviger(childrenItem.path);
                    }
                  }}
                  className={
                    clickIndex === childrenIndex
                      ? styles.contentTabBarShow
                      : styles.contentTabBar
                  }
                >
                  {childrenItem.title}
                </div>
              );
            })}
          </div>
          <Outlet />
        </div>
      );
    });
  };

  return (
    <div>
      {routerTabBarContent(routerArray)}
      <Outlet />
    </div>
  );
};
export default Home;
