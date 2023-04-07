import styles from "./index.module.scss"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import useAction from "./hook"
import { Button, CircularProgress } from "@mui/material"
import ModalBox from "../../components/modal/modal"

const User = () => {
  const {
    corpsList,
    corpAppList,
    corpAppLoadedList,
    addCorpRef,
    onAddCorpCancel,
    addAppRef,
    onAddAppCancel,
    onListClick,
  } = useAction()

  return (
    <div className={styles.user}>
      {/* 注册用户弹窗 */}
      <ModalBox ref={addCorpRef} onCancel={onAddCorpCancel}>
        <></>
      </ModalBox>
      {/* 添加apikey弹窗 */}
      <ModalBox ref={addAppRef} onCancel={onAddAppCancel}>
        <></>
      </ModalBox>
      <Button
        variant="contained"
        className={styles.registerButton}
        onClick={addCorpRef.current?.open}
      >
        新增企业
      </Button>
      {corpsList?.map((item, key) => (
        <Accordion className={styles.accordion} key={key}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className={styles.accordionSummary}
            onClick={() => onListClick(item.id)}
            id="AccordionSummary"
          >
            <Typography>{item.corpName}</Typography>
            <Button
              variant="contained"
              className={styles.addButton}
              onClick={(event) => {
                addAppRef.current?.open()
                event.stopPropagation()
              }}
            >
              新增应用
            </Button>
            <Button
              variant="contained"
              className={styles.addButton}
              onClick={(event) => {
                addAppRef.current?.open()
                event.stopPropagation()
              }}
            >
              修改
            </Button>
            {corpAppLoadedList.includes(item.id) &&
              !corpAppList.find((x) => x[0].workWeChatCorpId === item.id) && (
                <div className={styles.addButton} style={{ color: "#bbb" }}>
                  <CircularProgress size="1.5rem" color="inherit" />
                </div>
              )}
          </AccordionSummary>
          {corpAppList.map((items) => {
            return items.map((apikeyItem, apikeyIndex) => {
              if (apikeyItem.workWeChatCorpId === item.id) {
                return (
                  <AccordionDetails
                    key={apikeyIndex}
                    className={styles.accordionDetails}
                  >
                    <Typography>{apikeyItem.name}</Typography>
                    <Button
                      variant="contained"
                      className={styles.addButton}
                      onClick={(event) => {
                        addAppRef.current?.open()
                        event.stopPropagation()
                      }}
                    >
                      修改
                    </Button>
                  </AccordionDetails>
                )
              }
            })
          })}
        </Accordion>
      ))}
    </div>
  )
}

export default User
