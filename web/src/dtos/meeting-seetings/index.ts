import { Dispatch, SetStateAction } from "react";
import { IDepartmentAndUserListValue } from "../enterprise";

export interface DateTimeProps {
  date: string;
  time: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  setTime: React.Dispatch<React.SetStateAction<string>>;
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
  value: number;
  lable: string;
}

export enum CalendarSelectData {
  CalendarForMARS = 1,
  CalendarForELK = 2,
  CalendarForJKL = 3,
}

export enum ReminderTimeSelectData {
  FiveMinutesAgo = 300,
  FifteenMinutesAgo = 900,
  MeetingBegins = 0,
  AnHourAgo = 3600,
  TheDayBefore = 86400,
}

export enum RepeatSelectData {
  EveryDay = 0,
  Weekly = 1,
  Monthly = 2,
  EveryWorkingDay = 7,
  Repeat = 9,
  Custom = 10,
}

export enum MeetingRecording {
  Soundcloud = 1,
  LocalRecording = 2,
}

export enum RecordWatermark {
  On,
  Off,
}

export enum MeetingCallReminder {
  All = 3,
  Appoint = 4,
  NoRemind = 1,
  Host = 2,
}

export enum MutewhenJoining {
  On = 0,
  Off = 1,
  MoreThanSixOn = 2,
}

export enum MembershipRestrictions {
  InternalMembers = 0,
  All = 1,
}

export interface SelectGroupType {
  title: string;
  key: string;
  value: string | number;
  data: SelectDataType[];
  isIcon?: boolean;
}

export enum DefaultDisplay {
  Participant = 6,
  hostList = 10,
  DisplayName = 2,
}

export interface SettingDialogProps {
  open: boolean;
  setDialog: (value: boolean) => void;
  openAddDialog: boolean;
  setOpenAddDialog: (value: boolean) => void;
  setClickName?: Dispatch<SetStateAction<string>>;
  appointList?: IDepartmentAndUserListValue[];
  hostList?: IDepartmentAndUserListValue[];
  handleGetSettingData?: (data: WorkWeChatMeetingSettingDto) => void;
  settings: WorkWeChatMeetingSettingDto;
  setSettings: React.Dispatch<
    React.SetStateAction<WorkWeChatMeetingSettingDto>
  >;
}

export interface MeetingSettingsProps {
  isOpenMeetingSettings: boolean;
  setIsOpenMeetingSettings: React.Dispatch<React.SetStateAction<boolean>>;
  meetingIdCorpIdAndAppId?: MeetingIdCorpIdAndAppId | null;
  getMeetingList: () => void;
  meetingState: string;
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
  isOption: boolean;
  optionData?: number;
  optionList?: SelectDataType[];
  icon?: boolean;
  password?: number;
  key?: string;
}

export interface WorkWeChatMeetingUserDto {
  userid: string[];
}

export interface WorkWeChatMeetingReminderDto {
  is_repeat: number; //是否是周期性会议，1：周期性会议 0：非周期性会议。默认为0
  repeat_type: number; //0：每天；1：每周；2：每月；7：每个工作日
  repeat_until: number; //重复结束时刻，默认设置为最大结束时间
  repeat_interval: number; //重复间隔。目前仅当repeat_type为2时，即周期为周时，支持设置该字段，且值不能大于2。
  remind_before: [number] | null;
}

export interface WorkWeChatMeetingSettingDto {
  password: number | null; //入会密码，仅可输入4-6位纯数字
  enable_waiting_room: boolean; //是否开启等候室。true:开启等候室；false:不开启等候室；默认不开
  allow_enter_before_host: boolean; //是否允许成员在主持人进会前加入。true:允许；false:不允许。默认允许
  remind_scope: number; //WorkWeChatMeetingRemindScopeinteger($int32)1：不提醒；2：仅提醒主持人；3：提醒所有成员入；4：指定部份人响铃
  enable_enter_mute: number; //0：关闭；1：开启；2：超过6人后自动开启静音
  allow_external_user: boolean; //true:所有成员可入会；false:仅企业内部成员可入会 。默认所有成员可入会
  enable_screen_watermark: boolean; //是否开启屏幕水印，true:开启；false:不开启。默认不开启
  hosts?: WorkWeChatMeetingUserDto;
  ring_users?: WorkWeChatMeetingUserDto;
}

export interface CreateOrUpdateWorkWeChatMeetingDto {
  appId: string;
  admin_userid: string; //会议创建人id
  title: string; //会议标题
  meeting_start: number; //integer($int64),会议开始时间
  meeting_duration: number; //	integer($int64),会议时长
  description?: string; //会议描述
  location?: string; //会议地点
  attendees?: WorkWeChatMeetingUserDto;
  meetingid?: string; //会议id，修改才必传
  cal_id?: string; //日程
  settings?: Partial<WorkWeChatMeetingSettingDto>;
  reminders?: Partial<WorkWeChatMeetingReminderDto>;
}

export interface CreateWorkWeChatMeeting {
  createWorkWeChatMeeting: CreateOrUpdateWorkWeChatMeetingDto;
}

export interface CreateMeetingResponse {
  errCode: number;
  errorMsg: string;
  meetingid: string;
  excessUsers: string[];
}

export interface GetWorkWeChatMeeting {
  AppId: string;
  MeetingId: string;
}

export interface GetMeetingResponse {
  errcode: number;
  errmsg: string;
  admin_userid: string;
  title: string;
  meeting_start: number;
  meeting_duration: number;
  description: string;
  location: string;
  main_department: number;
  status: number;
  agentid: number;
  attendees: {
    member: {
      userid: string;
      status: number;
      firstJoinTime: number;
      lastQuitTime: number;
      totalJoinCount: number;
      cumulativeTime: number;
    }[];
    tmpExternalUser: {
      userid: string;
      status: number;
      firstJoinTime: number;
      lastQuitTime: number;
      totalJoinCount: number;
      cumulativeTime: number;
    }[];
  };
  settings: WorkWeChatMeetingSettingDto;
  cal_id: string;
  reminders: WorkWeChatMeetingReminderDto;
  meeting_code: string;
  meeting_link: string;
}

export interface GetAllMeetingsData {
  id: string;
  workWeChatCorpApplicationId: string;
  workWeChatCorpId: string;
  meetingId: string;
  adminUserId: string;
  title: string;
  meetingCode: string;
  meetingLink: string;
  meetingStart: number;
  meetingDuration: number;
  description: string;
  location: string;
  presentMember: string[];
  absentMember: string[];
  mainDepartment: number;
  status: number;
  agentId: number;
  calId: string;
  password: number | null;
  enableWaitingRoom: boolean;
  allowEnterBeforeHost: boolean;
  remindScope: number;
  enableEnterMute: number;
  allowExternalUser: boolean;
  enableScreenWatermark: boolean;
  hosts: string;
  ringUsers: string;
  isRepeat: number;
  repeatType: number;
  repeatUntil: number;
  repeatInterval: number;
  remindBefore: null;
  createdDate: string;
  isDelete: boolean;
}

export interface GetAllMeetingDto {
  PageIndex: number;
  PageSize: number;
  KeyWord: string;
}

export interface GetAllMeetingResponse {
  meetings: GetAllMeetingsData[];
  rowCount: 13;
}

export enum MeetingStatus {
  待开始 = 1,
  会议中,
  已结束,
  已取消,
  已过期,
}

export interface CancelWorkWeChatMeetingDto {
  cancelWorkWeChatMeeting: {
    appId: string;
    meetingid: string;
  };
}

export interface CancelMeetingResponse {
  errcode: number;
  errmsg: string;
}

export interface UpdateMeetingResponse {
  errcode: number;
  errmsg: string;
  excess_users: [];
}

export interface MeetingIdCorpIdAndAppId {
  meetingId: string;
  corpId: string;
  appId: string;
}
