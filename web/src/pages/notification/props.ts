import {
  ICorpAppData,
  ICorpData,
  IDtoExtend,
  IMessageTypeData,
  SendTypeCustomListDto,
  TimeZoneCustomListDto,
} from "../../dtos/enterprise"

export enum CycleOptionType {
  PerMonth = 10,
  PerTwoweeks = 20,
  PerWeek = 30,
  PerDay = 40,
}

export enum WeekDayType {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}

export interface SendNoticeProps {
  dto: IDtoExtend
  updateData: (k: keyof IDtoExtend, v: any) => void
  getMessageJob: () => void
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

export interface HookProps {
  getMessageJob: () => void
}
