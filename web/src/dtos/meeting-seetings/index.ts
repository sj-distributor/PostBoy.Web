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
  startTime = 0, //开始时间
  endTime = 1, //结束时间
}

export interface SelectDataType {
  value: number;
  lable: string;
}

export enum CalendarSelectData {
  CalendarForMARS = 1, //mars的日历
  CalendarForELK = 2, //elk的日历
  CalendarForJKL = 3, //jkl的日历
}

//会议开始提醒时间
export enum ReminderTimeSelectData {
  FiveMinutesAgo = 300, //五分钟前提醒
  FifteenMinutesAgo = 900, //十五分钟前提醒
  MeetingBegins = 0, //会议开始时提醒
  AnHourAgo = 3600, //一小时前提醒
  TheDayBefore = 86400, //一天前提醒
}

export enum RepeatSelectData {
  EveryDay = 0, //0：每天重复会议；
  Weekly = 1, //1：每周重复会议；
  Monthly = 2, //2：每月重复会议；
  EveryWorkingDay = 7, //7：每个工作日重复会议
  NoRepeat = 9, //不重复会议
  Custom = 10, //自定义会议重复
}

//自动开启会议录制
export enum MeetingRecording {
  Soundcloud = 1, //主持人入会后开启云录制
  LocalRecording = 2, //主持人入会后开启本地录制
}

export enum RecordWatermark {
  On, //开启屏幕共享水印
  Off, //关闭屏幕共享水印
}

//会议开始时来电提醒
export enum MeetingCallReminder {
  All = 3, //所有成员
  Appoint = 4, //指定成员
  NoRemind = 1, //不提醒
  Host = 2, //仅主持人
}

export enum MutewhenJoining {
  On = 0, //开启成员入会时静音
  Off = 1, //关闭成员入会时静音
  MoreThanSixOn = 2, //超过6人自动开启静音
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
  Participant = 6, //大于六人隐藏多余参会人
  hostList = 10, //最大选择十位会议主持人
  DisplayName = 2, //主持人于提醒人ui默认显示2个名字
}

export enum IsRepeat {
  NonRecurringMeetings, //0：非周期性会议。默认为0
  PeriodicMeetings, //1：周期性会议
}

//会议时长
export enum MeetingDuration {
  Minutes = 1800, //三十分钟
  OneHour = 3600, //一小时
  TwoHours = 7200, //两小时
  ThreeHours = 10800, //三小时
  CustomEndTime, //自定义时长
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

export interface MeetingSettingList {
  title: string;
  border: boolean;
  optionType?: "checkbox" | "input" | "dailog"; //checkbox:会议设置列表右边显示复选框，input：显示密码输入框，dailog：点击打开弹出
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
  is_repeat: number;
  repeat_type: number;
  repeat_until: number;
  repeat_interval: number;
  remind_before: [number] | null;
}

export interface WorkWeChatMeetingSettingDto {
  password: number | null;
  enable_waiting_room: boolean;
  allow_enter_before_host: boolean;
  remind_scope: number;
  enable_enter_mute: number;
  allow_external_user: boolean;
  enable_screen_watermark: boolean;
  hosts?: WorkWeChatMeetingUserDto;
  ring_users?: WorkWeChatMeetingUserDto;
}

export interface CreateOrUpdateWorkWeChatMeetingDto {
  appId: string;
  admin_userid: string;
  title: string;
  meeting_start: number;
  meeting_duration: number;
  description?: string;
  location?: string;
  attendees?: WorkWeChatMeetingUserDto;
  meetingid?: string;
  cal_id?: string;
  settings?: Partial<WorkWeChatMeetingSettingDto>;
  reminders?: Partial<WorkWeChatMeetingReminderDto>;
}

export interface CreateWorkWeChatMeeting {
  createWorkWeChatMeeting: CreateOrUpdateWorkWeChatMeetingDto;
}

export interface CreateMeetingResponse {
  errcode: number;
  errormsg: string;
  meetingid: string;
  excessUsers: string[];
}

export interface GetWorkWeChatMeeting {
  AppId: string;
  MeetingId: string;
}

export interface MeetingAttendeesUserData {
  userid: string;
  status: number;
  firstJoinTime: number;
  lastQuitTime: number;
  totalJoinCount: number;
  cumulativeTime: number;
}

export interface MeetingAttendees {
  member: MeetingAttendeesUserData[];
  tmpExternalUser: MeetingAttendeesUserData[];
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
  attendees: MeetingAttendees;
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

//会议状态
export enum MeetingStatus {
  待开始 = 1, //1会议待开始
  会议中, //2会议中
  已结束, //3已结束
  已取消, //4已取消
  已过期, //已过期
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
