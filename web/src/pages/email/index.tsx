import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import useAction from "./hook"
import styles from "./index.module.scss"
import { Editor, Toolbar } from "@wangeditor/editor-for-react"
import "@wangeditor/editor/dist/css/style.css"
import { useState } from "react"
import * as wangEditor from "@wangeditor/editor"

const SendEmail = () => {
  const {} = useAction()

  const emailList = [
    "maxon1@sj.com",
    "maxon2@sj.com",
    "maxon3@sj.com",
    "maxon4@sj.com"
  ]

  const toolbarConfig = {}
  const editorConfig = {
    placeholder: "请输入内容..."
  }

  const [editor, setEditor] = useState<wangEditor.IDomEditor | null>(null) // 存储 editor 实例
  const [html, setHtml] = useState("<p>hello</p>")

  const inputSx = { marginLeft: "1rem", flex: 1 }

  return (
    <div className={styles.wrap}>
      <div className={styles.inputGroup}>
        <span>从: </span>
        <Autocomplete
          id="Autocomplete-corpAppListId"
          multiple
          openOnFocus
          disablePortal
          disableClearable
          options={emailList}
          sx={inputSx}
          // getOptionLabel={(option) => }
          // isOptionEqualToValue={(option, value) => }
          onChange={(e, value) => {}}
          renderInput={(params) => (
            <TextField
              {...params}
              className={styles.corpInput}
              type="text"
              variant="standard"
            />
          )}
        />
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
