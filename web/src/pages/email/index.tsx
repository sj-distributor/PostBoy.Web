import useAction from "./hook"
import styles from "./index.module.scss"
import { Editor, Toolbar } from "@wangeditor/editor-for-react"
import "@wangeditor/editor/dist/css/style.css"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import Chip from "@mui/material/Chip"
import SendIcon from "@mui/icons-material/Send"
import ModalBox from "../../components/modal/modal"
import SendNotice from "../notification"
import ClearIcon from "@mui/icons-material/Clear"
import {
  ILastShowTableData,
  IUpdateMessageCommand,
  MessageJobDestination,
  MessageJobSendType,
} from "../../dtos/enterprise"
import DateSelector from "../enterprise/components/date-selector"
import TimeSelector from "../enterprise/components/time-selector"
import { sendTypeList, timeZone } from "../../dtos/send-message-job"
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material"
import { green } from "@mui/material/colors"

const SendEmail = (props: {
  emailUpdateData?: ILastShowTableData
  outterGetUpdateData?: (x: () => IUpdateMessageCommand | undefined) => void
}) => {
  const { emailUpdateData, outterGetUpdateData } = props
  const {
    toolbarConfig,
    editorConfig,
    inputSx,
    editor,
    html,
    emailFrom,
    emailList,
    isShowCopyto,
    sendRecordRef,
    emailToString,
    emailToArr,
    emailCopyToArr,
    emailCopyToString,
    emailSubject,
    sendTypeValue,
    dateValue,
    endDateValue,
    cronExp,
    timeZoneValue,
    promptText,
    openError,
    sendLoading,
    annexesList,
    validateAttrFunc,
    setTimeZoneValue,
    setCronError,
    setDateValue,
    setCronExp,
    showErrorPrompt,
    setEndDateValue,
    setSendTypeValue,
    setEmailSubject,
    setEmailCopyToArr,
    setEmailToArr,
    setEmailToString,
    setEmailCopyToString,
    setIsShowCopyto,
    setEditor,
    setHtml,
    setEmailFrom,
    validateEmail,
    clickSendRecord,
    handleClickSend,
    handleKeyDown,
    handleChange,
    handleBlur,
    handleAnnexDelete,
  } = useAction(outterGetUpdateData, emailUpdateData)

  return (
    <div className={styles.wrap}>
      <Snackbar
        message={promptText}
        open={openError}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
      <div className={styles.inputGroup}>
        <span id="select-label">从: </span>
        <Select
          variant="standard"
          value={emailFrom.senderId}
          className={styles.selectInput}
          inputProps={{
            type: "button",
          }}
          sx={inputSx}
          onChange={(event, child) => {
            const selected = emailList.find(
              (e) => e.displayName === event.target.value
            )
            selected && setEmailFrom(selected)
          }}
        >
          {emailList.map((item, index) => (
            <MenuItem value={item.senderId} key={index}>
              {item.displayName}
            </MenuItem>
          ))}
        </Select>
        <Box sx={{ position: "relative" }}>
          {!emailUpdateData && (
            <Button
              variant="contained"
              sx={{ marginLeft: "2rem" }}
              endIcon={<SendIcon />}
              disabled={sendLoading}
              onClick={handleClickSend}
            >
              Send
            </Button>
          )}
          {sendLoading && (
            <CircularProgress
              size={24}
              sx={{
                color: green[500],
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-0.8rem",
                marginLeft: "-0.8rem",
              }}
            />
          )}
        </Box>
        {!emailUpdateData && (
          <Button
            sx={{
              marginLeft: "2rem",
            }}
            variant="contained"
            onClick={() => clickSendRecord("open")}
          >
            发送记录
          </Button>
        )}

        <FormControl sx={{ ml: "2rem" }}>
          <InputLabel id="demo-simple-select-autowidth-label">
            发送类型
          </InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select"
            value={sendTypeValue}
            label="发送类型"
            onChange={(e) => {
              setSendTypeValue(Number(e.target.value))
            }}
          >
            {sendTypeList.map((item, key) => (
              <MenuItem key={key} value={item.value}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={styles.inputGroup}>
        <span>到:</span>
        <TextField
          {...validateAttrFunc(emailToString)}
          type="text"
          variant="standard"
          value={emailToString}
          className={styles.corpInput}
          sx={inputSx}
          onKeyDown={(e) => handleKeyDown(e, setEmailToArr, setEmailToString)}
          onBlur={(e) => handleBlur(e, setEmailToArr, setEmailToString)}
          onChange={(e) => handleChange(e, setEmailToArr, setEmailToString)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {emailToArr.map((item, index) => (
                  <Chip
                    size="small"
                    sx={{
                      marginLeft: "0.5rem",
                      border: !validateEmail(item)
                        ? "0.0625rem solid #d32f2f"
                        : "",
                    }}
                    label={item}
                    key={index}
                    onDelete={() => {
                      setEmailToArr((prev) => {
                        const newValue = prev.filter((x) => x)
                        newValue.splice(index, 1)
                        return newValue
                      })
                    }}
                    deleteIcon={<ClearIcon />}
                  />
                ))}
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={() => setIsShowCopyto((prev) => !prev)}>
                  抄送
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </div>
      {isShowCopyto && (
        <div className={styles.inputGroup}>
          <span>抄送:</span>
          <TextField
            {...validateAttrFunc(emailCopyToString)}
            type="text"
            variant="standard"
            value={emailCopyToString}
            className={styles.corpInput}
            sx={inputSx}
            onKeyDown={(e) =>
              handleKeyDown(e, setEmailCopyToArr, setEmailCopyToString)
            }
            onBlur={(e) =>
              handleBlur(e, setEmailCopyToArr, setEmailCopyToString)
            }
            onChange={(e) =>
              handleChange(e, setEmailCopyToArr, setEmailCopyToString)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {emailCopyToArr.map((item, index) => (
                    <Chip
                      size="small"
                      sx={{
                        marginLeft: "0.5rem",
                        border: !validateEmail(item)
                          ? "0.0625rem solid #d32f2f"
                          : "",
                      }}
                      label={item}
                      key={index}
                      onDelete={() => {
                        setEmailCopyToArr((prev) => {
                          const newValue = prev.filter((x) => x)
                          newValue.splice(index, 1)
                          return newValue
                        })
                      }}
                      deleteIcon={<ClearIcon />}
                    />
                  ))}
                </InputAdornment>
              ),
            }}
          />
        </div>
      )}
      <div className={styles.inputGroup}>
        <span>主题:</span>
        <TextField
          type="text"
          variant="standard"
          value={emailSubject}
          className={styles.corpInput}
          sx={inputSx}
          onChange={(e) => {
            setEmailSubject(e.target.value)
          }}
        />
      </div>

      {annexesList.length > 0 && (
        <div className={styles.annexes}>
          {annexesList.map((item, index) => {
            return (
              <Chip
                label={item.name}
                variant="outlined"
                sx={{
                  margin: "0.5rem 0.5rem",
                }}
                key={index}
                onDelete={() => handleAnnexDelete(item)}
              />
            )
          })}
        </div>
      )}
      <div className={styles.editorBox}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: "25rem" }}
        />
      </div>

      <div className={styles.timeSelector}>
        {(sendTypeValue === MessageJobSendType.Delayed ||
          sendTypeValue === MessageJobSendType.Recurring) && (
          <FormControl
            style={{
              width: 252,
              margin: "0.8rem 0",
            }}
          >
            <InputLabel id="demo-simple-select-label">时区</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={timeZoneValue}
              label="时区"
              onChange={(e) => {
                setTimeZoneValue(Number(e.target.value))
              }}
            >
              {timeZone
                .filter((x) => !x.disable)
                .map((item, key) => (
                  <MenuItem key={key} value={item.value}>
                    {item.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
        {sendTypeValue === MessageJobSendType.Delayed && (
          <div style={{ marginLeft: "1rem" }}>
            <DateSelector
              dateValue={dateValue}
              setDateValue={setDateValue}
              showErrorPrompt={showErrorPrompt}
            />
          </div>
        )}
        {sendTypeValue === MessageJobSendType.Recurring && (
          <TimeSelector
            cronExp={cronExp}
            setCronExp={setCronExp}
            setCronError={setCronError}
            endDateValue={endDateValue}
            setEndDateValue={setEndDateValue}
            showErrorPrompt={showErrorPrompt}
          />
        )}
      </div>

      <ModalBox
        ref={sendRecordRef}
        onCancel={() => clickSendRecord("close")}
        title={"发送记录"}
      >
        <SendNotice recordType={MessageJobDestination.Email} />
      </ModalBox>
    </div>
  )
}
export default SendEmail
