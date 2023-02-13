import { useBoolean } from "ahooks"
import { useEffect, useState } from "react"
import { IUpdateMessageCommand } from "../../../../dtos/enterprise"
import { NoticeSettingHookProps } from "./props"

export const useAction = (props: NoticeSettingHookProps) => {
  const { onUpdateMessageJob } = props

  const [updateData, setUpdateData] = useState<IUpdateMessageCommand>()

  const [promptText, setPromptText] = useState<string>("")

  const [openError, openErrorAction] = useBoolean(false)

  const [whetherToCallAPI, setWhetherToCallAPI] = useState<boolean>(false)

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

  const clickUpdate = () => {
    whetherToCallAPI
      ? !!updateData && onUpdateMessageJob(updateData)
      : showErrorPrompt(
          "The message job has information that is not filled in!"
        )
  }

  return {
    setUpdateData,
    setWhetherToCallAPI,
    promptText,
    openError,
    updateData,
    whetherToCallAPI,
    clickUpdate,
  }
}
