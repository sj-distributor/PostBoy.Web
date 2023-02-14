import { green } from "@mui/material/colors"
import { useBoolean } from "ahooks"
import { clone } from "ramda"
import { useEffect, useRef, useState } from "react"
import { PostMessageSend } from "../../../../api/enterprise"
import { ISendMessageCommand } from "../../../../dtos/enterprise"
import { ModalBoxRef } from "../../../../dtos/modal"
import { convertType } from "../../../../uilts/convert-type"
import { parameterJudgment } from "../../../../uilts/parameter-judgment"

const useAction = () => {
  const [sendData, setSendData] = useState<ISendMessageCommand>()

  const [promptText, setPromptText] = useState<string>("")

  const [openError, openErrorAction] = useBoolean(false)

  const [isShowMessageParams, setIsShowMessageParams] = useState<boolean>(false)

  const sendRecordRef = useRef<ModalBoxRef>(null)

  const [loading, loadingAction] = useBoolean(false)
  const [success, successAction] = useBoolean(false)
  const [failSend, failSendAction] = useBoolean(false)
  const [clearData, setClearData] = useBoolean(false)

  const clickSendRecord = (operation: string) => {
    operation === "open"
      ? sendRecordRef.current?.open()
      : sendRecordRef.current?.close()
  }

  const handleSubmit = async () => {
    if (!loading) {
      successAction.setFalse()
      loadingAction.setTrue()
      const cloneData = clone(sendData)
      if (!!cloneData) {
        cloneData.workWeChatAppNotification = convertType(
          cloneData.workWeChatAppNotification
        )
      }
      if (parameterJudgment(cloneData, showErrorPrompt)) {
        if (!!cloneData) {
          // 接口调用
          PostMessageSend(cloneData)
            .then((res) => {
              successAction.setTrue()
              loadingAction.setFalse()
              setTimeout(() => {
                setClearData.setTrue()
              }, 2000)
            })
            .catch((error) => {
              loadingAction.setFalse()
              failSendAction.setTrue()
            })
        }
      } else {
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
    } else if (failSend) {
      setTimeout(() => {
        failSendAction.setFalse()
      }, 3000)
    } else if (success) {
      setTimeout(() => {
        successAction.setFalse()
      }, 3000)
    }
  }, [openError, failSend, success])

  useEffect(() => {
    if (clearData) {
      setTimeout(() => {
        setClearData.setFalse()
      }, 1500)
    }
  }, [clearData])

  return {
    setSendData,
    promptText,
    openError,
    clickSendRecord,
    isShowMessageParams,
    setIsShowMessageParams,
    sendRecordRef,
    handleSubmit,
    buttonSx,
    loading,
    showErrorPrompt,
    success,
    failSend,
    successAction,
    failSendAction,
    clearData,
  }
}

export default useAction
