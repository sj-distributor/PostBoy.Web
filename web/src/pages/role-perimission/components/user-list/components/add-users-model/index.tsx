import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import styles from "./index.module.scss";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FolderIcon from "@mui/icons-material/Folder";

export const AddUsersModel = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.leftGroupBox}>
        <div>
          <input type="search" className="mui-input-clear" placeholder="" />
        </div>
        <div>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            OPERATION INC.
          </Typography>
          <List>
            <ListItem>
              <Checkbox defaultChecked />
              <ListItemIcon>
                <ArrowRightIcon />
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Single-line item" />
            </ListItem>
          </List>
        </div>
      </div>
      <div className={styles.rightGroupBox}>
        <div>已选一个用户</div>
        <div className={styles.selectListWrap}>
          <div>AAAAAAAAA.A</div>
          <div className={styles.cancel}>x</div>
        </div>
        <div className={styles.buttonBox}>
          <Button variant="contained" className={styles.button}>
            确认
          </Button>
          <Button variant="outlined" className={styles.button}>
            取消
          </Button>
        </div>
      </div>
    </div>
  );
};
