import { Button, Menu, MenuItem } from "@mui/material";
import styles from "./index.module.scss";
import useAuth from "../../../../auth";
import useAction from "./hook";
import PersonIcon from "@mui/icons-material/Person";

const UserInformation = () => {
  const { username, signOut } = useAuth();
  const { menuElement, setMenuElement, handleMenu } = useAction();

  return (
    <>
      <Button
        className={styles.iconBox}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleMenu}
      >
        <PersonIcon sx={{ color: "#000" }} />
      </Button>
      <Menu
        open={menuElement !== null}
        onClose={() => setMenuElement(null)}
        anchorEl={menuElement}
      >
        <MenuItem className={styles.username}>{username}</MenuItem>
        <MenuItem onClick={() => signOut()}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserInformation;
