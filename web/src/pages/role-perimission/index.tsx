import { Outlet } from "react-router-dom";

import styles from "./index.module.scss";

export const RolePermission = () => {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
};
