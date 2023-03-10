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
  MessageJobDestination,
  MessageJobSendType,
} from "../../dtos/enterprise"
import DateSelector from "../enterprise/components/date-selector"
import TimeSelector from "../enterprise/components/time-selector"
import { sendTypeList, timeZone } from "../../dtos/send-message-job"
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material"
import { green } from "@mui/material/colors"

const SendEmail = () => {
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
    open,
    promptText,
    openError,
    sendLoading,
    validateAttrFunc,
    setOpen,
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
  } = useAction()

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
        <span id="select-label">???: </span>
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
          <Button
            variant="contained"
            sx={{ marginLeft: "2rem" }}
            endIcon={<SendIcon />}
            disabled={sendLoading}
            onClick={handleClickSend}
          >
            Send
          </Button>
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
        <Button
          sx={{
            marginLeft: "2rem",
          }}
          variant="contained"
          onClick={() => clickSendRecord("open")}
        >
          ????????????
        </Button>
        <Button
          sx={{
            marginLeft: "2rem",
          }}
          variant="contained"
          onClick={() => setOpen(true)}
        >
          ??????????????????
        </Button>
      </div>
      <div className={styles.inputGroup}>
        <span>???:</span>
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
                  ??????
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </div>
      {isShowCopyto && (
        <div className={styles.inputGroup}>
          <span>??????:</span>
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
        <span>??????:</span>
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

      <Dialog
        open={open}
        PaperProps={{
          sx: {
            maxWidth: "none",
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">??????????????????</DialogTitle>
        <DialogContent sx={{ minWidth: "30rem" }}>
          <FormControl fullWidth sx={{ m: "1rem 0 1rem 0" }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              ????????????
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select"
              value={sendTypeValue}
              label="????????????"
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
          <div className={styles.dateSelector}>
            {(sendTypeValue === MessageJobSendType.Delayed ||
              sendTypeValue === MessageJobSendType.Recurring) && (
              <FormControl
                style={{
                  width: 252,
                  margin: "0.8rem 0",
                }}
              >
                <InputLabel id="demo-simple-select-label">??????</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={timeZoneValue}
                  label="??????"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>??????</Button>
        </DialogActions>
      </Dialog>

      <ModalBox
        ref={sendRecordRef}
        onCancel={() => clickSendRecord("close")}
        title={"????????????"}
      >
        <SendNotice recordType={MessageJobDestination.Email} />
      </ModalBox>
    </div>
  )
}
export default SendEmail
