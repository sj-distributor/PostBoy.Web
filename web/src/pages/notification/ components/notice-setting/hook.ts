import { useBoolean } from "ahooks"
import { useEffect, useState } from "react"
import { IUpdateMessageCommand } from "../../../../dtos/enterprise"
import { NoticeSettingHookProps } from "./props"

export const useAction = (props: NoticeSettingHookProps) => {
  const { onUpdateMessageJob } = props

  const [updateData, setUpdateData] = useState<IUpdateMessageCommand>()

  const clickUpdate = () => {
    !!updateData && onUpdateMessageJob(updateData)
  }

  return {
    setUpdateData,
    clickUpdate,
  }
}
