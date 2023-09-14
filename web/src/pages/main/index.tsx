import styles from "./index.module.scss";
import { Link, Outlet } from "react-router-dom";
import { routerArray } from "../../router/elementRoute";
import useMainAction from "./hook";
import UserInformation from "./components/user-information";
import { RouteItem } from "../../dtos/route";
import { createContext } from "react";

interface AdministratorContextType {
  haveAdministrator: boolean;
}

export const AdministratorContext = createContext<AdministratorContextType>(
  null!
);

const Main = () => {
  const { clickMainIndex, setMainClickIndex, haveAdministrator } =
    useMainAction();

  const verifyPermissions = (item: RouteItem) =>
    ["/user", "/manager"].includes(item.path) ? !!haveAdministrator : true;

  const routerTabBar = () => {
    return routerArray.map((item, index) => {
      return (
        <div key={index} className={styles.item}>
          {verifyPermissions(item) && (
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
          )}
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
          <AdministratorContext.Provider value={{ haveAdministrator }}>
            <Outlet />
          </AdministratorContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default Main;
