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
        <h1>{username}</h1>
      </div>
      <div>
        <Accordion className={styles.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className={styles.accordionSummary}
          >
            <Typography>用户名</Typography>
          </AccordionSummary>
          <AccordionDetails className={styles.accordionDetails}>
            <Typography>{username}</Typography>
          </AccordionDetails>
          <AccordionDetails className={styles.accordionDetails}>
            <Typography>apikey</Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default User;
