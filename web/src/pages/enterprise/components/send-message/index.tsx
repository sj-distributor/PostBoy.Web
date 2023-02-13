import TextField from "@mui/material/TextField"
import useAction from "./hook"
import styles from "./index.module.scss"
import SendNotice from "../../../notification"
import { Button, Switch, Snackbar } from "@mui/material"
import ModalBox from "../../../../components/modal/modal"
import SelectContent from "../select-content"

const SendMessage = () => {
  const {
    setSendData,
    clickSendRecord,
    isShowMessageParams,
    setIsShowMessageParams,
    sendRecordRef,
    setWhetherToCallAPI,
    promptText,
    openError,
  } = useAction()

  return (
    <div className={styles.sendMsgBox}>
      <Snackbar
        message={promptText}
        open={openError}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
      <div className={styles.selectInputBox}>
        <SelectContent
          getSendData={setSendData}
          isNewOrUpdate={"new"}
          setWhetherToCallAPI={setWhetherToCallAPI}
        />
      </div>
      <Button
        sx={{
          height: "3.5rem",
          width: "7rem",
          fontSize: "1rem",
          marginLeft: "1.5rem",
        }}
        variant="contained"
      >
        发 送
      </Button>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Switch
          sx={{ display: "none" }}
          value={isShowMessageParams}
          onChange={(e) => {
            setIsShowMessageParams((e.target as HTMLInputElement).checked)
          }}
        />
        <Button
          style={{ display: "flex" }}
          onClick={() => clickSendRecord("open")}
        >
          发送记录
        </Button>
      </div>

      {isShowMessageParams && (
        <div className={styles.textarea}>
          <TextField
            id="TextField-paramsJsonId"
            label="参数Json"
            className={styles.multilineTextField}
            multiline
            rows={12}
          />
        </div>
      )}

      <ModalBox
        ref={sendRecordRef}
        onCancel={() => clickSendRecord("close")}
        title={"发送记录"}
      >
        <SendNotice />
      </ModalBox>
    </div>
  )
}

export default SendMessage
