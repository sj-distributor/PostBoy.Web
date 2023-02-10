import { useEffect, useState } from "react"
import { GetEmailData } from "../../api/email"
import * as wangEditor from "@wangeditor/editor"
import { IEmailResonponse } from "../../dtos/email"

const useAction = () => {
  const [editor, setEditor] = useState<wangEditor.IDomEditor | null>(null) // 存储 editor 实例
  const [html, setHtml] = useState("")
  const [emailFrom, setEmailFrom] = useState<IEmailResonponse>()
  const [emailList, setEmailList] = useState<IEmailResonponse[]>([])

  const toolbarConfig = {
    toolbarKeys: [
      "fontFamily",
      "fontSize",
      "color",
      "|",
      "bold",
      "italic",
      "underline",
      "through",
      "bgColor",
      "sup",
      "sub",
      "|",
      "bulletedList",
      "numberedList",
      "justifyJustify",
      "delIndent",
      "indent",
      "|",
      "uploadImage",
      "insertLink",
      "insertTable",
      "|",
      "redo",
      "undo"
    ]
  }

  const editorConfig = {
    placeholder: "请输入内容...",
    MENU_CONF: {
      uploadImage: {
        // server: "/api/upload" 图片上传地址
      }
    }
  }

  const inputSx = { marginLeft: "1rem", flex: 1 }

  useEffect(() => {
    GetEmailData().then((data) => {
      // 获取发送信息
      data && setEmailList(data)
      data && setEmailFrom(data[0])
    })
  }, [])

  useEffect(() => {
    // console.log(editor?.children) // 获取编辑器内容JSON格式
    // console.log(editor?.getText()) // 获取编辑器内容TEXT格式
    // console.log(editor?.getHtml()) // 获取编辑器内容HTML格式
  }, [editor?.children])

  // 及时销毁 editor
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return {
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
  }
}
export default useAction
