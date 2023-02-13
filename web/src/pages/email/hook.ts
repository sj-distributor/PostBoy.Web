import { useEffect, useState } from "react"
import { GetEmailData } from "../../api/email"
import * as wangEditor from "@wangeditor/editor"
import { IEmailResonponse } from "../../dtos/email"
import { annexEditorConfig } from "../../uilts/wangEditor"

const useAction = () => {
  const defaultEmailValue = {
    displayName: "",
    senderId: ""
  }
  const [editor, setEditor] = useState<wangEditor.IDomEditor | null>(null) // 存储 editor 实例
  const [html, setHtml] = useState("")
  const [emailFrom, setEmailFrom] =
    useState<IEmailResonponse>(defaultEmailValue)
  const [emailList, setEmailList] = useState<IEmailResonponse[]>([])
  const [emailTo, setEmailTo] = useState("")
  const [emailCopyTo, setEmailCopyTo] = useState("")
  const [isShowCopyto, setIsShowCopyto] = useState(false)

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  const toolbarConfig: Partial<wangEditor.IToolbarConfig> = {
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
      "undo",
      "uploadAttachment"
    ]
  }

  const editorConfig = {
    placeholder: "请输入内容...",
    autoFocus: false,
    hoverbarKeys: {
      ...annexEditorConfig.hoverbarKeys
    },
    MENU_CONF: {
      uploadImage: {
        // server: "/api/upload" 图片上传地址
      },
      ...annexEditorConfig.MENU_CONF
    }
  }

  const inputSx = { marginLeft: "1rem", flex: 1 }

  useEffect(() => {
    GetEmailData().then((data) => {
      // 获取发送信息
      if (data && data.length > 0) {
        setEmailList(data)
        setEmailFrom(data[0])
      }
    })
  }, [])

  useEffect(() => {
    console.log(editor?.children) // 获取编辑器内容JSON格式
    console.log(editor?.getText(), "---", JSON.stringify(editor?.getText())) // 获取编辑器内容TEXT格式
    console.log(editor?.getHtml()) // 获取编辑器内容HTML格式
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
    emailTo,
    isShowCopyto,
    emailCopyTo,
    setEmailCopyTo,
    setIsShowCopyto,
    setEmailTo,
    validateEmail,
    setEditor,
    setHtml,
    setEmailFrom
  }
}
export default useAction
