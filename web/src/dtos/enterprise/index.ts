export interface IResponseMsg {
  errcode: number
  errmsg: string
}

export interface ICorpData {
  corpId: string
  corpName: string
  id: string
}

export interface ICorpAppData {
  agentId: number
  appId: string
  id: string
  name: string
  secret: string
  workWeChatCorpId: string
}

export interface ICorpAppListApiData {
  CorpId: string
}

export interface IDepartmentListApiData {
  Id?: number
  AppId: string
}

export interface IDepartmentUsersListApiData {
  DepartmentId: number
  AppId: string
}

export interface IDepartmentData {
  department_leader: []
  id: number
  name: string
  name_en: null
  order: number
  parentid: number
  departmentUserList: IDepartmentUsersData[]
  selected: boolean
}

export interface IDepartmentUsersData {
  name: string
  userid: string
  department: number[]
  open_userid: string
  selected: boolean
}

export interface IDepartmentAndUserListValue {
  id: number | string
  name: string
  type?: DepartmentAndUserType
  parentid: number | string
}

export enum DepartmentAndUserType {
  Department,
  User,
}

export interface IDepartmentResponse extends IResponseMsg {
  department: IDepartmentData[]
}

export interface IDepartmentUsersResonse extends IResponseMsg {
  userlist: IDepartmentUsersData[]
}

export interface IMessageTypeData {
  title: string
  groupBy: string
  type: MessageDataType
}

export enum MessageDataType {
  Image,
  Voice,
  Video,
  File,
  Text,
}

export interface ITargetDialogProps {
  open: boolean
  departmentList: IDepartmentData[]
  flattenDepartmentList: IDepartmentAndUserListValue[]
  AppId: string
  isLoading: boolean
  tagsList: ITagsList[]
  setOpenFunction: (open: boolean) => void
  getDialogValue: (data: ITargetDialogValue) => void
}

export interface ITargetDialogValue {
  deptAndUserValueList: IDepartmentData[]
  tagsValue: ITagsList
}

export enum MessageWidgetShowStatus {
  ShowInput,
  ShowUpload,
  ShowAll,
}

export interface ITagsListResponse extends IResponseMsg {
  taglist: ITagsList[]
}

export interface ITagsList {
  tagId: number
  tagName: string
}

export enum SendType {
  InstantSend,
  SpecifiedDate,
  SendPeriodically,
}

export interface IMessageJobDto {
  count: number
  messageJobs: IMessageJob[]
}

export interface IMessageJob extends IMessageJobSame {
  metadata: {
    id: string
    createDate: string
    messageJobId: string
    key: string
    value: string
  }[]
}

export interface IMessageJobSame {
  id: string
  jobId: string
  createdDate: string
  correlationId: string
  userAccountId: string
  commandJson: string
  jobType: MessageJobType
  jobSettingJson: string
  destination: MessageJobDestination
}

export enum MessageJobType {
  Fire,
  Delayed,
  Recurring,
}

export enum MessageJobDestination {
  WorkWeChat,
}

export interface IMessageJobRecord extends IMessageJobRecordSame {
  responseJson: string
}

export interface IMessageJobRecordSame {
  id: string
  createdDate: string
  correlationId: string
  result: MessageSendResult
}

export enum MessageSendResult {
  Ok,
  Failed,
}

export interface ISendMessageCommand {
  correlationId: string
  jobSetting?: IJobSettingDto
  metadata: { key: string; value: string }[]
  workWeChatAppNotification: IWorkWeChatAppNotificationDto
}

export interface IJobSettingDto {
  timezone?: string
  delayedJob?: {
    enqueueAt: string
  }
  recurringJob?: {
    cronExpression: string
  }
}

export interface IWorkWeChatAppNotificationDto {
  appId?: string
  chatId?: string
  toTags?: string[]
  toUsers: string[]
  toParties?: string[]
  text?: {
    content: string
  }
  file?: { fileName: string; fileContent: string; fileType: MessageDataType }
  mpNews?: {
    articles: {
      title: string
      author: string
      digest: string
      content: string
      fileContent: string
      contentSourceUrl: string
    }[]
  }
}

export enum TimeType {
  UTC,
  America,
}

export interface IDtoExtend {
  loading: boolean
  rowCount: number
  pageSize: number
  page: number
  messageJobs: IMessageJob[]
}

export interface ILastShowTableData extends IMessageJobSame {
  title: string
  content: string
}

export interface ISendRecordDto extends IMessageJobRecordSame {
  sendTheObject: string[] | string
  errorSendtheobject: string[] | string
}
