import SendNotice from "../notification";
import styles from "./index.module.scss";

const Enterprise = () => {
  return (
    <div className={styles.enterpriseBox}>
      <SendNotice />
    </div>
  );
};
export default Enterprise;
