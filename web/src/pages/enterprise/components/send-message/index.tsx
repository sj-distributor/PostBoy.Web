import TextField from "@mui/material/TextField"
import useAction from "./hook"
import styles from "./index.module.scss"
import SendNotice from "../../../notification"
import {
  Button,
  Switch,
  Snackbar,
  Box,
  CircularProgress,
  Alert,
  AlertTitle
} from "@mui/material"
import ModalBox from "../../../../components/modal/modal"
import SelectContent from "../select-content"
import { green } from "@mui/material/colors"
import { MessageJobDestination } from "../../../../dtos/enterprise"

const SendMessage = () => {
  const {
    setSendData,
    clickSendRecord,
    isShowMessageParams,
    setIsShowMessageParams,
    sendRecordRef,
    promptText,
    openError,
    handleSubmit,
    buttonSx,
    loading,
    showErrorPrompt,
    success,
    failSend,
    clearData
  } = useAction()

  return (
    <div className={styles.sendMsgBox}>
      <Snackbar
        message={promptText}
        open={openError}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      />
      <Snackbar
        open={success}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Alert severity="success">
          <AlertTitle>Sent successfully</AlertTitle>
        </Alert>
      </Snackbar>
      <Snackbar
        open={failSend}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Alert severity="error">
          <AlertTitle>Failed to send</AlertTitle>
        </Alert>
      </Snackbar>
      <div className={styles.selectInputBox}>
        <SelectContent
          getSendData={setSendData}
          isNewOrUpdate={"new"}
          showErrorPrompt={showErrorPrompt}
          clearData={clearData}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          padding: "0rem 8rem"
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Button
            variant="contained"
            style={{
              height: "3.5rem",
              width: "7rem",
              fontSize: "1rem"
            }}
            sx={buttonSx}
            disabled={loading}
            onClick={handleSubmit}
          >
            发 送
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: green[500],
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-0.8rem",
                marginLeft: "-0.8rem"
              }}
            />
          )}
        </Box>
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
        <SendNotice recordType={MessageJobDestination.WorkWeChat} />
      </ModalBox>
    </div>
  )
}

export default SendMessage
