import { Dispatch, SetStateAction } from "react";
import { IDepartmentAndUserListValue } from "../enterprise";

export interface DateTimeProps {
  getDate: (data: string) => void;
  getTime: (data: string) => void;
}

export interface DateTimeData {
  date: string;
  time: string;
}

export enum SelectType {
  startTime = 0,
  endTime = 1,
}

export interface SelectDataType {
  value: string;
  lable: string;
}

export enum CalendarSelectData {
  CalendarForMARS = "1",
  CalendarForELK = "2",
  CalendarForJKL = "3",
}

export enum ReminderTimeSelectData {
  FifteenMinutesAgo = "1",
  MeetingBegins = "2",
  AnHourAgo = "3",
}

export enum RepeatSelectData {
  Repeat = "1",
  NoRepeat = "2",
}

export enum MeetingRecording {
  Soundcloud = "1",
  LocalRecording = "2",
}

export enum RecordWatermark {
  SingleRowWatermark = "1",
  DoubleRowWatermark = "2",
}

export enum MeetingCallReminder {
  All = "1",
  Appoint = "2",
  Host = "3",
  NoRemind = "4",
}

export enum MutewhenJoining {
  On = "1",
  Off = "2",
  MoreThanSixOn = "3",
}

export enum MembershipRestrictions {
  All = "1",
  InternalMembers = "2",
}

export interface SelectGroupType {
  title: string;
  key: string;
  value: string | null;
  data: SelectDataType[];
  isIcon?: boolean;
}

export enum DefaultDisplay {
  Participant = 6,
}

export interface AddDialogProps {
  open: boolean;
  setDialog: (value: boolean) => void;
  type: "AddMembers" | "DesignatedHost" | "DesignatedMembers";
  resettingAppointRadio?: (value: string) => void;
  getSelectListData: (data: SelectParticipantList[]) => void;
}

export interface SettingDialogProps {
  open: boolean;
  setDialog: (value: boolean) => void;
  openAddDialog: boolean;
  setOpenAddDialog: (value: boolean) => void;
  setClickName?: Dispatch<SetStateAction<string>>;
  appointList?: IDepartmentAndUserListValue[];
  hostList?: IDepartmentAndUserListValue[];
}

export interface SettingDialogType {
  open: boolean;
  setDialog: (value: boolean) => void;
  type: "AddMembers" | "DesignatedHost" | "DesignatedMembers";
}

export interface MeetingSettingList {
  title: string;
  border: boolean;
  optionType?: "checkbox" | "input" | "dailog";
  isOption?: boolean;
  optionData?: string;
  optionList?: SelectDataType[];
  icon?: boolean;
  password?: string;
}

export interface SelectParticipantList {
  avatar: string;
  name: string;
}

export interface ContactsDataType {
  groupChat: {
    groupName: string;
    groupDataList: SelectParticipantList[];
  };
}
