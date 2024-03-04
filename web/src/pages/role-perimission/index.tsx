import { Outlet } from "react-router-dom";

import styles from "./index.module.scss";
import { SnackbarProvider } from "notistack";

export const RolePermission = () => {
  return (
    <div className={styles.container}>
      <SnackbarProvider
        autoHideDuration={2000}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Outlet />
      </SnackbarProvider>
    </div>
  );
};
