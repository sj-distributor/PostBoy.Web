import styles from "./index.module.scss"

import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import useAuth from "../../auth"
import useAction from "./hook"
import { Button } from "@mui/material"
import { useBoolean } from "ahooks"
import { GetUserApikeys } from "../../api/user-management"
import { useRef, useState } from "react"
import { IUserApikeysResponse } from "../../dtos/user-management"
import ModalBox from "../../components/modal/modal"
import { ModalBoxRef } from "../../dtos/modal"
import AddApiKeyPopup from "./component/add-aipkey"
import RegistrationPopup from "./component/registration"
const User = () => {
  // const { username } = useAuth()
  const { usersList, GetAllUsers } = useAction()
  const [openApikey, openApikeyAction] = useBoolean(false)
  const [userApikeyList, setUserApikey] = useState<IUserApikeysResponse[][]>([])
  const [openApikeyUserId, setOpenApikeyUserId] = useState<string[]>([])
  const registerRef = useRef<ModalBoxRef>(null)
  const addApikeyRef = useRef<ModalBoxRef>(null)
  const [userAccountId, setUserAccountId] = useState<string>("")

  const onRegisterCancel = () => {
    registerRef.current?.close()
  }

  const onAddApikeyCancel = () => {
    addApikeyRef.current?.close()
  }

  const onListClick = async (userId: string) => {
    // 判断是否存过id,如果存储过不再重复调api
    if (!openApikeyUserId.find((x) => x === userId)) {
      const clickApiKeyUserId: string[] = openApikeyUserId
      clickApiKeyUserId.push(userId)
      setOpenApikeyUserId(clickApiKeyUserId)
      await GetUserApikeys(userId).then((res) => {
        if (!!res) {
          const apikeyList = userApikeyList
          apikeyList.push(res)
          setUserApikey(apikeyList)
        }
      })
    }

    console.log("userID", openApikeyUserId)
    console.log("list", userApikeyList)

    openApikeyAction.toggle()
  }

  return (
    <div className={styles.user}>
      {/* 注册用户弹窗 */}
      <ModalBox ref={registerRef} onCancel={onRegisterCancel}>
        <RegistrationPopup
          onRegisterCancel={onRegisterCancel}
          GetAllUsers={GetAllUsers}
        />
      </ModalBox>
      {/* 添加apikey弹窗 */}
      <ModalBox ref={addApikeyRef} onCancel={onAddApikeyCancel}>
        <AddApiKeyPopup
          userAccountId={userAccountId}
          onAddApikeyCancel={onAddApikeyCancel}
          GetAllUsers={GetAllUsers}
        />
      </ModalBox>
      <div>
        <Accordion className={styles.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className={styles.accordionSummary}
          >
            <Typography className={styles.listText}>用户名</Typography>
            <Button
              variant="outlined"
              className={styles.registerButton}
              onClick={registerRef.current?.open}
            >
              注册用户
            </Button>
          </AccordionSummary>

          {usersList?.map((item, key) => (
            <Accordion
              style={{ marginLeft: "1rem" }}
              key={key}
              className={styles.accordion}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className={styles.accordionSummary}
                onClick={() => onListClick(item.id)}
              >
                <Typography>{item.userName}</Typography>
                <Button
                  variant="outlined"
                  className={styles.addButton}
                  onClick={() => {
                    addApikeyRef.current?.open()
                    setUserAccountId(item.id)
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
        </Accordion>
      </div>
    </div>
  )
}

export default User
