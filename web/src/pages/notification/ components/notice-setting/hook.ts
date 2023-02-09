import { useEffect, useState } from "react"
import {
  ICorpAppData,
  ICorpData,
  IMessageTypeData,
  ITagsList,
  MessageDataType,
  MessageJobType,
  SendObject,
} from "../../../../dtos/enterprise"
import {
  messageTypeList,
  timeZone,
} from "../../../enterprise/components/send-message/hook"
import { NoticeSettingHookProps } from "./props"

export const useAction = (props: NoticeSettingHookProps) => {
  const { updateMessageJobInformation } = props

  const [corpsValue, setCorpsValue] = useState<ICorpData>()

  const [corpAppValue, setCorpAppValue] = useState<ICorpAppData>()

  const [messageFileType, setMessageFileType] = useState<IMessageTypeData>(
    messageTypeList[0]
  )

  const [type, setType] = useState<MessageJobType>(
    updateMessageJobInformation.jobType
  )

  const [timeZoneValue, setTimeZoneValue] = useState<number>(1)

  const [isShowDialog, setIsShowDialog] = useState<boolean>(false)

  const [cronExp, setCronExp] = useState<string>("0 0 * * *")

  const [dateValue, setDateValue] = useState<string>("")

  const [endDateValue, setEndDateValue] = useState<string>("")

  // 发送标签
  const [tagsValue, setTagsValue] = useState<ITagsList[]>([])

  // 发送人员
  const [sendObject, setSendObject] = useState<SendObject>({
    toUsers: [],
    toParties: [],
  })

  useEffect(() => {
    const timeZoneData = timeZone.find(
      (item) =>
        item.title ===
        JSON.parse(updateMessageJobInformation.jobSettingJson).Timezone
    )

    if (!!timeZoneData) setTimeZoneValue(timeZoneData?.value)
  }, [updateMessageJobInformation])

  useEffect(() => {
    setCorpsValue(updateMessageJobInformation.enterprise)
    setCorpAppValue(updateMessageJobInformation.app)

    const type = updateMessageJobInformation.workWeChatAppNotification
    if (!!type.text) {
      setMessageFileType(messageTypeList[0])
    } else if (!!type.file) {
      switch (type.file.fileType) {
        case MessageDataType.Image: {
          setMessageFileType(messageTypeList[2])
          break
        }
        case MessageDataType.Voice: {
          setMessageFileType(messageTypeList[3])
          break
        }
        case MessageDataType.Video: {
          setMessageFileType(messageTypeList[4])
          break
        }
        case MessageDataType.File: {
          setMessageFileType(messageTypeList[5])
          break
        }
      }
    } else if (!!type.mpNews) {
      setMessageFileType(messageTypeList[1])
    }
  }, [updateMessageJobInformation])

  return {
    corpsValue,
    setCorpsValue,
    corpAppValue,
    setCorpAppValue,
    messageFileType,
    setMessageFileType,
    type,
    setType,
    timeZoneValue,
    setTimeZoneValue,
    isShowDialog,
    setIsShowDialog,
    cronExp,
    setCronExp,
    dateValue,
    setDateValue,
    endDateValue,
    setEndDateValue,
    tagsValue,
    setTagsValue,
    setSendObject,
  }
}
