import { Button } from "@mui/material";
import { useBoolean } from "ahooks";
import SendNotice from "../notification";
import styles from "./index.module.scss";

const Enterprise = () => {
  const [switchPage, switchPageAction] = useBoolean();

  return (
    <div className={styles.enterpriseBox}>
      <Button onClick={switchPageAction.toggle} className={styles.switchSend}>
        {switchPage ? `< 实时发送` : `< 定时发送`}
      </Button>
      {switchPage && <SendNotice />}
    </div>
  );
};
export default Enterprise;
