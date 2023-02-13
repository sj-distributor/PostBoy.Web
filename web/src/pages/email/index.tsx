import useAction from "./hook"
import styles from "./index.module.scss"
import { Editor, Toolbar } from "@wangeditor/editor-for-react"
import "@wangeditor/editor/dist/css/style.css"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Button from "@mui/material/Button"
import SendIcon from "@mui/icons-material/Send"

const SendEmail = () => {
  const {
    toolbarConfig,
    editorConfig,
    inputSx,
    editor,
    html,
    emailFrom,
    emailList,
    emailTo,
    setEmailTo,
    setEditor,
    setHtml,
    setEmailFrom,
    validateEmail
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
        >
          Send
        </Button>
      </div>
      <div className={styles.inputGroup}>
        <span>到:</span>
        <TextField
          type="text"
          variant="standard"
          helperText={!validateEmail(emailTo) ? "Incorrect entry." : ""}
          className={styles.corpInput}
          sx={inputSx}
          value={emailTo}
          error={!validateEmail(emailTo)}
          onChange={(e) => {
            setEmailTo(e.target.value)
          }}
        />
      </div>
      <div className={styles.inputGroup}>
        <span>主题:</span>
        <TextField
          type="text"
          variant="standard"
          className={styles.corpInput}
          sx={inputSx}
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
    </div>
  )
}
export default SendEmail
