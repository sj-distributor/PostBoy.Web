import TextField from "@mui/material/TextField"
import useAction from "./hook"
import styles from "./index.module.scss"
import { Editor, Toolbar } from "@wangeditor/editor-for-react"
import "@wangeditor/editor/dist/css/style.css"
import { MenuItem, Select } from "@mui/material"

const SendEmail = () => {
  const {
    toolbarConfig,
    editorConfig,
    inputSx,
    editor,
    html,
    emailFrom,
    emailList,
    setEditor,
    setHtml,
    setEmailFrom
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
          value={emailFrom}
          className={styles.selectInput}
          inputProps={{
            type: "button"
          }}
          sx={inputSx}
          onChange={(event, child) => {
            setEmailFrom(
              emailList.find((e) => e.displayName === event.target.value)
            )
          }}
        >
          {emailList.map((item, index) => (
            <MenuItem value={item.senderId} key={index}>
              {item.displayName}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={styles.inputGroup}>
        <span>到:</span>
        <TextField
          className={styles.corpInput}
          sx={inputSx}
          type="text"
          variant="standard"
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
