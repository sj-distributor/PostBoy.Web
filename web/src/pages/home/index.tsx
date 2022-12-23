import { Link, Outlet } from "react-router-dom";
import { RouteItem } from "../../dtos/routeType";
import { routerArray } from "../../router/elementRoute";
import useAction from "./hook";

import styles from "./index.module.scss";

const Home = () => {
  const { clickIndex, setClickIndex } = useAction();

  const routerTabBarContent = (list: RouteItem[]) => {
    return list.map((item, index) => {
      return (
        <div className={styles.contentTab} key={index}>
          {item.children?.map((childrenItem, childrenIndex) => {
            return (
              <Link
                key={childrenIndex}
                to={childrenItem.path}
                onClick={() => {
                  setClickIndex(childrenIndex);
                }}
                className={
                  clickIndex === childrenIndex
                    ? styles.contentTabBarShow
                    : styles.contentTabBar
                }
              >
                {childrenItem.title}
              </Link>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className={styles.content}>
      {routerTabBarContent(routerArray)}
      <Outlet />
    </div>
  );
};
export default Home;
