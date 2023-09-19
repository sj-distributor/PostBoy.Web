import { Link, Outlet, useLocation } from "react-router-dom";
import { RoleFrom } from "./components/role-from";
import { RolePermissions } from "./components/role-permissions";
import { UserList } from "./components/user-list";
import styles from "./index.module.scss";
import { ChildProps } from "../../dtos/route";
import { routerArray } from "../../router/elementRoute";
import useAction from "./hook";
import { AdministratorContext } from "../main";
import { useContext } from "react";

export const RolePermission = () => {
  const { click, setClick } = useAction();

  const location = useLocation();

  const parentPath = location.pathname
    .split("/")
    .filter((item: any) => !!item)
    .map((item: any) => `/${item}`)[0];

  const routerTabBarContent = () => {
    const homeRouter = routerArray.find((item) => item.path === parentPath);

    return (
      <div className={styles.nav}>
        {homeRouter?.children?.map((childItem, childIndex) => {
          return (
            childItem && (
              <Link
                key={childIndex}
                to={childItem.path}
                onClick={() => {
                  setClick(childIndex);
                }}
                className={
                  click === childIndex ? styles.navBarActive : styles.navBar
                }
              >
                {childItem.title}
              </Link>
            )
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.home}>
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </div>
  );
};
// return (
//   <div className={styles.home}>
//     {/* <RoleFrom /> */}
//     {/* <UserList /> */}
//
//   </div>
// );
// };
