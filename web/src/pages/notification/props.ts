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

export interface SendNoticeProps {}
