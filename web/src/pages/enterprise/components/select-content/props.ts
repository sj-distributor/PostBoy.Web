import {
  ICorpAppData,
  ICorpData,
  IMessageTypeData,
  SendTypeCustomListDto,
  TimeZoneCustomListDto,
} from "../../../../dtos/enterprise"

export interface SelectContentProps {
  inputClassName: string
  corpAppValue: ICorpAppData | undefined
  corpsList: ICorpData[]
  corpAppList: ICorpAppData[]
  corpsValue: ICorpData | undefined
  messageTypeList: IMessageTypeData[]
  messageTypeValue: IMessageTypeData
  sendTypeValue: number
  sendTypeList: SendTypeCustomListDto[]
  timeZone: TimeZoneCustomListDto[]
  timeZoneValue: number
  setCorpsValue: React.Dispatch<React.SetStateAction<ICorpData | undefined>>
  setCorpAppValue: React.Dispatch<
    React.SetStateAction<ICorpAppData | undefined>
  >
  setMessageTypeValue: React.Dispatch<React.SetStateAction<IMessageTypeData>>
  setSendTypeValue: React.Dispatch<React.SetStateAction<number>>
  setTimeZoneValue: React.Dispatch<React.SetStateAction<number>>
  setIsShowDialog: React.Dispatch<React.SetStateAction<boolean>>
}
