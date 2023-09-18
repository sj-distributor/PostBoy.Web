import { RoleFrom } from "./components/role-from";
import { UserList } from "./components/user-list";
import styles from "./index.module.scss";

export const RolePermission = () => {
  return (
    <div className={styles.home}>
      {/* <RoleFrom /> */}
      <UserList />
    </div>
  );
};
