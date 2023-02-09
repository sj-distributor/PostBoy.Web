import {
  FileObject,
  ICorpAppData,
  ICorpData,
  IMessageTypeData,
  ITagsList,
  SendObject,
  SendTypeCustomListDto,
  TimeZoneCustomListDto,
} from "../../../../dtos/enterprise"

export interface SelectContentProps {
  inputClassName: string
  sendTypeList: SendTypeCustomListDto[]
  corpAppValue?: ICorpAppData
  corpsValue?: ICorpData
  messageTypeList: IMessageTypeData[]
  messageTypeValue: IMessageTypeData
  sendTypeValue: number
  timeZone: TimeZoneCustomListDto[]
  timeZoneValue: number
  isShowDialog: boolean
  cronExp?: string
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>
  oldFile: FileObject
  setFile: React.Dispatch<React.SetStateAction<FileObject>>
  setTagsValue: React.Dispatch<React.SetStateAction<ITagsList[]>>
  dateValue: string
  setDateValue: React.Dispatch<React.SetStateAction<string>>
  endDateValue: string
  setEndDateValue: React.Dispatch<React.SetStateAction<string>>
  setCronExp: React.Dispatch<React.SetStateAction<string>>
  setCorpsValue: React.Dispatch<React.SetStateAction<ICorpData | undefined>>
  setCorpAppValue: React.Dispatch<
    React.SetStateAction<ICorpAppData | undefined>
  >
  setMessageTypeValue: React.Dispatch<React.SetStateAction<IMessageTypeData>>
  setSendTypeValue: React.Dispatch<React.SetStateAction<number>>
  setTimeZoneValue: React.Dispatch<React.SetStateAction<number>>
  setIsShowDialog: React.Dispatch<React.SetStateAction<boolean>>
  setSendObject: React.Dispatch<React.SetStateAction<SendObject>>
}

export interface SelectContentHookProps {
  corpsValue: ICorpData | undefined
  corpAppValue: ICorpAppData | undefined
  setCorpsValue: React.Dispatch<React.SetStateAction<ICorpData | undefined>>
  setCorpAppValue: React.Dispatch<
    React.SetStateAction<ICorpAppData | undefined>
  >
  setSendObject: React.Dispatch<React.SetStateAction<SendObject>>
}
