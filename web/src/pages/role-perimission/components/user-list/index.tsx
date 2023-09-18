import styles from "./index.module.scss";

import { Button, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAction } from "./hook";

export const UserList = () => {
  const { handleSearch } = useAction();

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <div className={styles.navTitle}>用户列表</div>
        <div className={styles.navSearch}>
          <TextField
            className={styles.navInput}
            size="small"
            variant="outlined"
            placeholder="搜索用户名"
            fullWidth
          />
          <div className={styles.navIcon}>
            <IconButton aria-label="Search" onClick={handleSearch}>
              <SearchIcon className={styles.navFont} />
            </IconButton>
          </div>
        </div>
        <div className={styles.navBtn}>
          <Button className={styles.btn} variant="contained">
            添加用户
          </Button>
          <Button className={styles.btnDel} variant="contained">
            批量移除
          </Button>
          <Button className={styles.btn} variant="outlined">
            返回
          </Button>
        </div>
      </div>
      <div className={styles.content}>内容</div>
      <div className={styles.footer}>底部</div>
    </div>
  );
};
