import { useBoolean } from "ahooks"
import { useEffect, useRef, useState } from "react"
import { ISendMessageCommand } from "../../../../dtos/enterprise"
import { ModalBoxRef } from "../../../../dtos/modal"

const useAction = () => {
  const [sendData, setSendData] = useState<ISendMessageCommand>()

  const [promptText, setPromptText] = useState<string>("")

  const [openError, openErrorAction] = useBoolean(false)

  const [isShowMessageParams, setIsShowMessageParams] = useState<boolean>(false)

  const sendRecordRef = useRef<ModalBoxRef>(null)

  const [whetherToCallAPI, setWhetherToCallAPI] = useState<boolean>(false)

  const clickSendRecord = (operation: string) => {
    operation === "open"
      ? sendRecordRef.current?.open()
      : sendRecordRef.current?.close()
  }

  // 弹出警告
  const showErrorPrompt = (text: string) => {
    setPromptText(text)
    openErrorAction.setTrue()
  }

  // 延迟关闭警告提示
  useEffect(() => {
    if (openError) {
      setTimeout(() => {
        openErrorAction.setFalse()
      }, 3000)
    }
  }, [openError])

  useEffect(() => {
    if (sendData !== undefined) console.log(sendData, "sendData--")
  }, [sendData])

  return {
    setSendData,
    promptText,
    openError,
    clickSendRecord,
    isShowMessageParams,
    setIsShowMessageParams,
    sendRecordRef,
    setWhetherToCallAPI,
  }
}

export default useAction
