import { Link, Outlet, useLocation } from "react-router-dom";
import { RoleFrom } from "./components/role-from";
import { RolePermissions } from "./components/role-permissions";
import { UserList } from "./components/user-list";
import styles from "./index.module.scss";
import { useContext } from "react";
import { AdministratorContext } from "../main";
import { routerArray } from "../../router/elementRoute";

import { ChildProps } from "../../dtos/route";
import { useAction } from "./hook";

export const RolePermission = () => {
  return (
    <div className={styles.home}>
      <Outlet />
      {/* {path === "/roles/userList" && <UserList />}
      {path === "/roles/editRole" && <RoleFrom />}
      {(path === "/roles/roleList" || path === "/roles") && <RolePermissions />} */}
    </div>
  );
};
