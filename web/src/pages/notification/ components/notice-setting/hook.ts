import { useBoolean } from "ahooks"
import { useEffect, useState } from "react"
import { IUpdateMessageCommand } from "../../../../dtos/enterprise"
import { NoticeSettingHookProps } from "./props"

// props: NoticeSettingHookProps

export const useAction = () => {
  const [updateData, setUpdateData] = useState<IUpdateMessageCommand>()

  const [promptText, setPromptText] = useState<string>("")

  const [openError, openErrorAction] = useBoolean(false)

  const [whetherToCallAPI, setWhetherToCallAPI] = useBoolean(false)

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
    if (updateData !== undefined) console.log(updateData, "updateData--")
  }, [updateData])

  return { setUpdateData, setWhetherToCallAPI, promptText, openError }
}
