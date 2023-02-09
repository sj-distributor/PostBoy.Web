import { useEffect, useState } from "react"
import {
  FileObject,
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

  const [cronExp, setCronExp] = useState<string>(
    JSON.parse(updateMessageJobInformation.jobSettingJson).RecurringJob
      ?.CronExpression !== null
      ? JSON.parse(updateMessageJobInformation.jobSettingJson).RecurringJob
          ?.CronExpression
      : "0 0 * * *"
  )

  const [dateValue, setDateValue] = useState<string>(
    JSON.parse(updateMessageJobInformation.jobSettingJson).DelayedJob
      ?.EnqueueAt !== null
      ? JSON.parse(updateMessageJobInformation.jobSettingJson).DelayedJob
          ?.EnqueueAt
      : ""
  )

  const [endDateValue, setEndDateValue] = useState<string>(
    JSON.parse(updateMessageJobInformation.jobSettingJson).RecurringJob
      ?.EndDate !== null
      ? JSON.parse(updateMessageJobInformation.jobSettingJson).RecurringJob
          ?.EndDate
      : ""
  )

  const [title, setTitle] = useState<string>(
    updateMessageJobInformation.title !== undefined
      ? updateMessageJobInformation.title
      : ""
  )

  const [content, setContent] = useState<string>(
    updateMessageJobInformation.content !== undefined
      ? updateMessageJobInformation.content
      : ""
  )

  const [oldFile, setOleFile] = useState<FileObject>({
    fileContent: !!updateMessageJobInformation.workWeChatAppNotification.file
      ?.fileContent
      ? updateMessageJobInformation.workWeChatAppNotification.file?.fileContent
      : "",
    fileName: !!updateMessageJobInformation.workWeChatAppNotification.file
      ?.fileName
      ? updateMessageJobInformation.workWeChatAppNotification.file?.fileName
      : "",
    fileType: !!updateMessageJobInformation.workWeChatAppNotification.file
      ?.fileType
      ? updateMessageJobInformation.workWeChatAppNotification.file?.fileType
      : 0,
    fileUrl: !!updateMessageJobInformation.workWeChatAppNotification.file
      ?.fileUrl
      ? updateMessageJobInformation.workWeChatAppNotification.file?.fileUrl
      : "",
  })

  const [file, setFile] = useState<FileObject>({
    fileContent: "",
    fileName: "",
    fileType: MessageDataType.Image,
  })

  // 发送标签
  const [tagsValue, setTagsValue] = useState<ITagsList[]>([])

  // 发送人员
  const [sendObject, setSendObject] = useState<SendObject>({
    toUsers: [],
    toParties: [],
  })

  useEffect(() => {
    setFile({ ...file, fileType: messageFileType.type })
  }, [messageFileType])

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
    title,
    setTitle,
    content,
    setContent,
    oldFile,
    file,
    setFile,
  }
}
