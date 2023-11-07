import styles from "./index.module.scss";
import { Link, Outlet } from "react-router-dom";
import useMainAction from "./hook";
import UserInformation from "./components/user-information";
import useAuth from "../../auth";

const Main = () => {
  const { filterRouter } = useAuth();

  const { clickMainIndex, setMainClickIndex } = useMainAction();

  const routerTabBar = () => {
    return filterRouter?.map((item, index) => {
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
            <div className={styles.iconTitleContainer}>
              {item.icons}
              <span className={styles.title}>{item.head}</span>
            </div>
          </Link>
        </div>
      );
    });
  };

  return (
    <div className={styles.main}>
      <div className={styles.sideBar}>
        <div className={styles.navBar}>{routerTabBar()}</div>
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
