import TextField from "@mui/material/TextField"
import useAction, { messageTypeList, sendTypeList, timeZone } from "./hook"
import styles from "./index.module.scss"
import SendNotice from "../../../notification"
import { Alert, Button, Snackbar, Switch } from "@mui/material"
import ModalBox from "../../../../components/modal/modal"
import SelectContent from "../select-content"

const SendMessage = () => {
  const {
    messageTypeValue,
    isShowDialog,
    isShowMessageParams,
    setIsShowMessageParams,
    sendTypeValue,
    cronExp,
    timeZoneValue,
    openError,
    openSuccess,
    promptText,
    setCorpsValue,
    setCorpAppValue,
    setMessageTypeValue,
    setIsShowDialog,
    setSendTypeValue,
    setCronExp,
    setDateValue,
    setTimeZoneValue,
    setTagsValue,
    sendRecordRef,
    sendRecordClose,
    dateValue,
    endDateValue,
    setEndDateValue,
    setSendObject,
    corpsValue,
    corpAppValue,
    sendRecordOpen,
    title,
    setTitle,
    content,
    setContent,
    file,
    setFile,
    pictureText,
    setPictureText,
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
      <Snackbar
        open={openSuccess}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          send success!
        </Alert>
      </Snackbar>
      <div className={styles.selectInputBox}>
        <SelectContent
          inputClassName={styles.inputWrap}
          sendTypeList={sendTypeList}
          sendTypeValue={sendTypeValue}
          setSendTypeValue={setSendTypeValue}
          timeZone={timeZone}
          timeZoneValue={timeZoneValue}
          setTimeZoneValue={setTimeZoneValue}
          messageTypeList={messageTypeList}
          messageTypeValue={messageTypeValue}
          setMessageTypeValue={setMessageTypeValue}
          corpsValue={corpsValue}
          setCorpsValue={setCorpsValue}
          corpAppValue={corpAppValue}
          setCorpAppValue={setCorpAppValue}
          isShowDialog={isShowDialog}
          setIsShowDialog={setIsShowDialog}
          cronExp={cronExp}
          setCronExp={setCronExp}
          dateValue={dateValue}
          setDateValue={setDateValue}
          endDateValue={endDateValue}
          setEndDateValue={setEndDateValue}
          setTagsValue={setTagsValue}
          setSendObject={setSendObject}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          pictureText={pictureText}
          setPictureText={setPictureText}
          file={file}
          setFile={setFile}
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
        // onClick={() => handleSubmit(sendTypeValue)}
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
        <Button style={{ display: "flex" }} onClick={() => sendRecordOpen()}>
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
        onCancel={() => sendRecordClose}
        title={"发送记录"}
      >
        <SendNotice />
      </ModalBox>
    </div>
  )
}

export default SendMessage
