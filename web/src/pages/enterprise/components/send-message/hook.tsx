import { useRef, useState } from "react"
import {
  ICorpAppData,
  ICorpData,
  IDepartmentKeyControl,
  IMessageTypeData,
  ISearchList,
  ITagsList,
  MessageDataType,
  MessageWidgetShowStatus,
  FileDto,
  SendTypeCustomListDto,
  TimeType,
  TimeZoneCustomListDto,
  MessageJobType,
  SendObject,
} from "../../../../dtos/enterprise"
import moment from "moment"
import { v4 as uuidv4 } from "uuid"
import { convertBase64 } from "../../../../uilts/convert-base64"
import { useBoolean } from "ahooks"
import { ModalBoxRef } from "../../../../dtos/modal"

export const sendTypeList: SendTypeCustomListDto[] = [
  { title: "即时发送", value: MessageJobType.Fire },
  { title: "指定日期", value: MessageJobType.Delayed },
  { title: "周期发送", value: MessageJobType.Recurring },
]

export const timeZone: TimeZoneCustomListDto[] = [
  { title: "UTC", value: TimeType.UTC },
  { title: "America/Los_Angeles", value: TimeType.America },
]

export const messageTypeList: IMessageTypeData[] = [
  { title: "文本", groupBy: "", type: MessageDataType.Text },
  { title: "图文", groupBy: "", type: MessageDataType.Image },
  { title: "图片", groupBy: "文件", type: MessageDataType.Image },
  { title: "语音", groupBy: "文件", type: MessageDataType.Voice },
  { title: "视频", groupBy: "文件", type: MessageDataType.Video },
  { title: "文件", groupBy: "文件", type: MessageDataType.File },
]

const useAction = () => {
  const [messageParams, setMessageParams] = useState<string>("")
  const [titleParams, setTitleParams] = useState<string>("")

  const [messageTypeValue, setMessageTypeValue] = useState<IMessageTypeData>(
    messageTypeList[0]
  )

  const [isShowDialog, setIsShowDialog] = useState<boolean>(false)
  const [isShowInputOrUpload, setIsShowInputOrUpload] =
    useState<MessageWidgetShowStatus>(MessageWidgetShowStatus.ShowAll)
  const [isShowMessageParams, setIsShowMessageParams] = useState<boolean>(false)

  const [corpsValue, setCorpsValue] = useState<ICorpData>()
  const [corpAppValue, setCorpAppValue] = useState<ICorpAppData>()

  const [departmentAndUserList, setDepartmentAndUserList] = useState<
    IDepartmentKeyControl[]
  >([])
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    ISearchList[]
  >([])

  const [isTreeViewLoading, setIsTreeViewLoading] = useState<boolean>(false)
  const [tagsList, setTagsList] = useState<ITagsList[]>([])

  const [cronExp, setCronExp] = useState<string>("") //mark 初始值应该为null
  const [cronError, setCronError] = useState<string>("")
  const [isAdmin, setIsAdmin] = useState<boolean>(true)
  const [dateValue, setDateValue] = useState<string>("")
  const [endDateValue, setEndDateValue] = useState<string>("")
  const [sendTypeValue, setSendTypeValue] = useState<number>(
    sendTypeList[0].value
  )
  const [timeZoneValue, setTimeZoneValue] = useState<number>(timeZone[0].value)
  const [fileList, setFileList] = useState<FileDto>()
  const [openError, openErrorAction] = useBoolean(false)
  const [openSuccess, openSuccessAction] = useBoolean(false)
  const sendRecordRef = useRef<ModalBoxRef>(null)
  const [promptText, setPromptText] = useState<string>("")

  const [title, setTitle] = useState<string>("")

  const [content, setContent] = useState<string>("")

  // 发送标签
  const [tagsValue, setTagsValue] = useState<ITagsList[]>([])

  // 发送人员
  const [sendObject, setSendObject] = useState<SendObject>({
    toUsers: [],
    toParties: [],
  })

  setTimeout(() => {
    openErrorAction.setFalse()
    openSuccessAction.setFalse()
  }, 3000)

  const onUploadFile = async (files: FileList) => {
    const file = files[0]
    const base64 = await convertBase64(file)
    setFileList({
      fileName: file.name,
      fileContent: base64 as string,
      fileType: messageTypeValue.type,
    })
  }

  const showErrorPrompt = (text: string) => {
    setPromptText(text)
    openErrorAction.setTrue()
  }

  const sendRecordOpen = () => {
    sendRecordRef?.current?.open()
  }

  const sendRecordClose = () => {
    sendRecordRef?.current?.close()
  }

  return {
    corpsValue,
    corpAppValue,
    messageParams,
    messageTypeValue,
    isShowDialog,
    isShowInputOrUpload,
    isShowMessageParams,
    departmentAndUserList,
    isTreeViewLoading,
    tagsList,
    flattenDepartmentList,
    sendTypeValue,
    cronExp,
    isAdmin,
    timeZoneValue,
    titleParams,
    openError,
    openSuccess,
    promptText,
    setDepartmentAndUserList,
    setCorpsValue,
    setCorpAppValue,
    setMessageParams,
    setMessageTypeValue,
    setIsShowDialog,
    setIsShowMessageParams,
    setSendTypeValue,
    setCronExp,
    setCronError,
    setDateValue,
    setTimeZoneValue,
    setTitleParams,
    onUploadFile,
    setTagsValue,
    sendRecordRef,
    sendRecordOpen,
    sendRecordClose,
    dateValue,
    endDateValue,
    setEndDateValue,
    setSendObject,
    title,
    setTitle,
    content,
    setContent,
  }
}

export default useAction
