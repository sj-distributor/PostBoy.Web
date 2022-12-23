import { Link, Outlet, useNavigate } from "react-router-dom";
import { RoutePrperty } from "../../dtos/routeType";
import { routerArray } from "../../router/elementRoute";
import useAction from "./hook";

import styles from "./index.module.scss";

const Home = () => {
  const { clickIndex, setClickIndex, navigate } = useAction();

  const routerTabBarContent = (list: RoutePrperty[]) => {
    return list.map((item, index) => {
      return (
        <div key={index} className={styles.content}>
          <div className={styles.contentTab}>
            {item.children?.map((childrenItem, childrenIndex) => {
              const nowStyle =
                clickIndex === childrenIndex
                  ? styles.contentTabBarShow
                  : styles.contentTabBar;
              return (
                <Link
                  key={childrenIndex}
                  to={childrenItem.path}
                  onClick={() => {
                    setClickIndex(childrenIndex);
                  }}
                  className={nowStyle}
                >
                  {childrenItem.title}
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
    <div>
      {routerTabBarContent(routerArray)}
      <Outlet />
    </div>
  );
};
export default Home;
