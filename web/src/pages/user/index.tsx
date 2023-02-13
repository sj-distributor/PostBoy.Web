import styles from "./index.module.scss"

import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import useAuth from "../../auth"
import useAction from "./hook"
import { Button } from "@mui/material"
import RegistrationPopup from "./component/registration-popup"

const User = () => {
  const { username } = useAuth()
  const { onRegister, isShowRegister } = useAction()

  return (
    <div className={styles.user}>
      {/* 注册用户弹窗 */}
      {isShowRegister && <RegistrationPopup />}
      <div>
        <Button
          variant="outlined"
          color="inherit"
          style={{ margin: "0.5rem 1.6rem" }}
          onClick={onRegister}
        >
          注册用户
        </Button>
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
  )
}

export default User
