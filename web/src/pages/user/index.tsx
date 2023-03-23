import styles from "./index.module.scss"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import useAction from "./hook"
import { Button } from "@mui/material"
import ModalBox from "../../components/modal/modal"
import AddApiKeyPopup from "./component/add-aipkey"
import RegistrationPopup from "./component/registration"

const User = () => {
  const {
    usersList,
    setUsersList,
    registerRef,
    onRegisterCancel,
    addApikeyRef,
    onAddApikeyCancel,
    userAccountId,
    userApikeyList,
    setUserApikey,
    onListClick,
    setUserAccountId,
  } = useAction()

  return (
    <div className={styles.user}>
      {/* 注册用户弹窗 */}
      <ModalBox ref={registerRef} onCancel={onRegisterCancel}>
        <RegistrationPopup
          onRegisterCancel={onRegisterCancel}
          setUsersList={setUsersList}
        />
      </ModalBox>
      {/* 添加apikey弹窗 */}
      <ModalBox ref={addApikeyRef} onCancel={onAddApikeyCancel}>
        <AddApiKeyPopup
          userAccountId={userAccountId}
          onAddApikeyCancel={onAddApikeyCancel}
          userApikeyList={userApikeyList}
          setUserApikey={setUserApikey}
        />
      </ModalBox>
      <Button
        variant="contained"
        className={styles.registerButton}
        onClick={registerRef.current?.open}
      >
        注册用户
      </Button>
      <div>
        {usersList?.map((item, key) => (
          <Accordion className={styles.accordion} key={key}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className={styles.accordionSummary}
              onClick={() => onListClick(item.id)}
              id="AccordionSummary"
            >
              <Typography>{item.userName}</Typography>
              <Button
                variant="contained"
                className={styles.addButton}
                onClick={(event) => {
                  setUserAccountId(item.id)
                  addApikeyRef.current?.open()
                  event.stopPropagation()
                }}
              >
                添加apikey
              </Button>
            </AccordionSummary>
            {userApikeyList.map((items) => {
              return items.map((apikeyItem, apikeyIndex) => {
                if (apikeyItem.userAccountId === item.id) {
                  return (
                    <AccordionDetails
                      key={apikeyIndex}
                      className={styles.accordionDetails}
                    >
                      <Typography>{apikeyItem.apiKey}</Typography>
                    </AccordionDetails>
                  )
                }
              })
            })}
          </Accordion>
        ))}
      </div>
    </div>
  )
}

export default User
