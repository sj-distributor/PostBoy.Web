import styles from "./index.module.scss";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useAuth from "../../auth";

const User = () => {
  const { username } = useAuth();

  return (
    <div className={styles.user}>
      <div className={styles.title}>
        <h1>用户界面管理</h1>
      </div>
      <div className={styles.accordion}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>用户名</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{username}</Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default User;
