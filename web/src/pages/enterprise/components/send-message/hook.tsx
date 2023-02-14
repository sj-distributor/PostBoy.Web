import { green } from "@mui/material/colors"
import { useBoolean } from "ahooks"
import { clone } from "ramda"
import { useEffect, useRef, useState } from "react"
import { PostMessageSend } from "../../../../api/enterprise"
import { ISendMessageCommand } from "../../../../dtos/enterprise"
import { ModalBoxRef } from "../../../../dtos/modal"
import { convertType } from "../../../../uilts/convert-type"

const useAction = () => {
  const [sendData, setSendData] = useState<ISendMessageCommand>()

  const [promptText, setPromptText] = useState<string>("")

  const [openError, openErrorAction] = useBoolean(false)

  const [isShowMessageParams, setIsShowMessageParams] = useState<boolean>(false)

  const sendRecordRef = useRef<ModalBoxRef>(null)

  const [whetherToCallAPI, setWhetherToCallAPI] = useState<boolean>(false)

  const [loading, loadingAction] = useBoolean(false)
  const [success, successAction] = useBoolean(false)
  const timer = useRef<number>()

  const clickSendRecord = (operation: string) => {
    operation === "open"
      ? sendRecordRef.current?.open()
      : sendRecordRef.current?.close()
  }

  const handleSubmit = async () => {
    if (!loading) {
      successAction.setFalse()
      loadingAction.setTrue()

      if (whetherToCallAPI) {
        const cloneData = clone(sendData)
        if (!!cloneData) {
          cloneData.workWeChatAppNotification = convertType(
            cloneData.workWeChatAppNotification
          )

          // 接口调用
          PostMessageSend(cloneData)
            .then((res) => {
              successAction.setTrue()
              loadingAction.setFalse()
              timer.current = window.setTimeout(() => {
                successAction.setFalse()
              }, 2000)
            })
            .catch((error) => {
              successAction.setFalse()
              loadingAction.setFalse()
            })
        }
      } else {
        showErrorPrompt(
          "The message job has information that is not filled in!"
        )
        successAction.setFalse()
        loadingAction.setFalse()
      }
    }
  }

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
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

  return {
    setSendData,
    promptText,
    openError,
    clickSendRecord,
    isShowMessageParams,
    setIsShowMessageParams,
    sendRecordRef,
    setWhetherToCallAPI,
    handleSubmit,
    buttonSx,
    loading,
    showErrorPrompt,
  }
}

export default useAction
