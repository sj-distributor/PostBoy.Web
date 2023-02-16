import { useEffect, useRef, useState } from "react"
import { GetEmailData } from "../../api/email"
import * as wangEditor from "@wangeditor/editor"
import { IEmailInput, IEmailResonponse } from "../../dtos/email"
import { annexEditorConfig } from "../../uilts/wangEditor"
import { ModalBoxRef } from "../../dtos/modal"
import { PostMessageSend } from "../../api/enterprise"

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
  const [emailToString, setEmailToString] = useState("")
  const [emailToArr, setEmailToArr] = useState<string[]>([])
  const [emailCopyToString, setEmailCopyToString] = useState("")
  const [emailCopyToArr, setEmailCopyToArr] = useState<string[]>([])
  const [emailSubject, setEmailSubject] = useState("")
  const [isShowCopyto, setIsShowCopyto] = useState(false)
  const sendRecordRef = useRef<ModalBoxRef>(null)

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  const clickSendRecord = (operation: string) => {
    operation === "open"
      ? sendRecordRef.current?.open()
      : sendRecordRef.current?.close()
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

  const handleClickSend = () => {
    const emailNotification = {
      senderId: emailFrom.senderId,
      subject: emailSubject,
      body: editor ? editor.getText() : "",
      to: emailToArr,
      cc: emailCopyToArr
    }
    PostMessageSend({
      emailNotification
    }).then((data) => {
      console.log(data)
    })
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    setString: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = (e.target as HTMLInputElement).value
    !!value.slice(0, -1) && (value.includes(";") || value.includes("；"))
      ? (() => {
          setArr((prev) => [...prev, value.slice(0, -1)])
          setString("")
        })()
      : setString(value)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    setString: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = (e.target as HTMLInputElement).value
    e.code === "Backspace" &&
      value === "" &&
      setArr((prev) => {
        const newValue = prev.filter((x) => x)
        newValue.splice(newValue.length - 1, 1)
        return newValue
      })
    if (!!value && (e.code === "Enter" || e.code === "NumpadEnter")) {
      setArr((prev) => [...prev, value])
      setString("")
    }
  }

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
    // console.log(JSON.stringify(emailToString))
  }, [emailToString])

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
    validateEmail,
    setEditor,
    setHtml,
    setEmailFrom,
    clickSendRecord,
    handleClickSend,
    handleKeyDown,
    handleChange
  }
}
export default useAction
