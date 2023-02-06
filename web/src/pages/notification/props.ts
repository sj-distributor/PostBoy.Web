import { IDtoExtend } from "../../dtos/enterprise"

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
}

export interface HookProps {
  getMessageJob: () => void
}
