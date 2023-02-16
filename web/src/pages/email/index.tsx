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
import { MessageJobDestination } from "../../dtos/enterprise"

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
    handleChange
  } = useAction()

  return (
    <div className={styles.wrap}>
      <div className={styles.inputGroup}>
        <span id="select-label">从: </span>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Age"
          variant="standard"
          value={emailFrom.senderId}
          className={styles.selectInput}
          inputProps={{
            type: "button"
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
        <Button
          sx={{ marginLeft: "2rem" }}
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleClickSend}
        >
          Send
        </Button>
        <Button
          sx={{
            marginLeft: "2rem"
          }}
          variant="contained"
          onClick={() => clickSendRecord("open")}
        >
          发送记录
        </Button>
      </div>
      <div className={styles.inputGroup}>
        <span>到:</span>
        <TextField
          type="text"
          variant="standard"
          value={emailToString}
          className={styles.corpInput}
          sx={inputSx}
          onKeyDown={(e) => handleKeyDown(e, setEmailToArr, setEmailToString)}
          onChange={(e) => handleChange(e, setEmailToArr, setEmailToString)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {emailToArr.map((item, index) => (
                  <Chip
                    size="small"
                    sx={{ marginLeft: "0.5rem" }}
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
            )
          }}
        />
      </div>
      {isShowCopyto && (
        <div className={styles.inputGroup}>
          <span>抄送:</span>
          <TextField
            type="text"
            variant="standard"
            value={emailCopyToString}
            className={styles.corpInput}
            sx={inputSx}
            onKeyDown={(e) =>
              handleKeyDown(e, setEmailCopyToArr, setEmailCopyToString)
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
                      sx={{ marginLeft: "0.5rem" }}
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
              )
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
