import { Outlet } from "react-router-dom";

import styles from "./index.module.scss";
import { SnackbarProvider } from "notistack";

export const RolePermission = () => {
  return (
    <div className={styles.container}>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Outlet />
      </SnackbarProvider>
    </div>
  );
};
