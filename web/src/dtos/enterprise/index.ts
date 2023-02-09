export interface IResponseMsg {
  errcode: number
  errmsg: string
}

export interface ICorpData {
  corpName: string
  id: string
}

export interface ICorpAppData {
  appId: string
  id: string
  name: string
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

export interface IDepartmentKeyControl {
  data: IDepartmentAndUserListValue[]
  key: string
}

export interface IDeptTreeList {
  data: IDepartmentData[]
  children: IDeptTreeList[]
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
  parentid: string
  selected: boolean
  isCollapsed?: boolean
  children: IDepartmentAndUserListValue[]
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

export interface FileObject {
  fileContent: string
  fileName: string
  fileType: MessageDataType
  fileUrl?: string
}

export interface ITargetDialogProps {
  open: boolean
  departmentAndUserList: IDepartmentKeyControl[]
  departmentKeyValue: IDepartmentKeyControl
  flattenDepartmentList: IDepartmentAndUserListValue[]
  AppId: string
  isLoading: boolean
  tagsList: ITagsList[]
  setOpenFunction: (open: boolean) => void
  setOuterTagsValue: React.Dispatch<React.SetStateAction<ITagsList[]>>
  setDeptUserList: React.Dispatch<React.SetStateAction<IDepartmentKeyControl[]>>
}

export interface ITargetDialogValue {
  deptAndUserValueList: IDepartmentData[]
  tagsValue: ITagsList[]
}

export enum MessageWidgetShowStatus {
  ShowInput,
  ShowUpload,
  ShowAll,
}

export interface ITagsListResponse extends IResponseMsg {
  taglist: ITagsList[]
}

export interface ISearchList {
  key: string
  data: IDepartmentAndUserListValue[]
}

export interface ITagsList {
  tagId: number
  tagName: string
}

export interface IMessageJobDto {
  count: number
  messageJobs: IMessageJob[]
}

export interface IMessageJob extends IMessageJobBase {
  metadata: {
    id: string
    createDate: string
    messageJobId: string
    key: string
    value: string
  }[]
  emailNotification?: {
    senderId: string
    subject: string
    body: string
    to: string[]
    cc: string[]
  }
}

export interface IMessageJobBase {
  id: string
  jobId: string
  createdDate: string
  correlationId: string
  userAccountId: string
  jobType: MessageJobType
  jobSettingJson: string
  jobCronExpressionDesc: string
  destination: MessageJobDestination
  workWeChatAppNotification: IWorkWeChatAppNotificationDto
}

export enum MessageJobType {
  Fire,
  Delayed,
  Recurring,
}

export enum MessageJobDestination {
  Email,
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

export const messageSendResultType = {
  [MessageSendResult.Ok]: "已发送",
  [MessageSendResult.Failed]: "异常",
}

export interface ISendMessageCommand {
  correlationId: string
  jobSetting?: IJobSettingDto
  metadata: { key: string; value: string }[]
  emailNotification?: {
    senderId: string
    subject: string
    body: string
    to: string[]
    cc: string[]
  }
  workWeChatAppNotification: IWorkWeChatAppNotificationDto
}

export interface IJobSettingDto {
  timezone?: string
  delayedJob?: {
    enqueueAt: Date
  }
  recurringJob?: {
    cronExpression: string
    endDate?: string
  }
}

export interface IWorkWeChatAppNotificationDto {
  appId?: string
  chatId?: string
  toTags?: string[]
  toUsers: string[]
  toParties?: string[]
  text?: TextDto
  file?: FileDto
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
export interface TextDto {
  content: string
}

export interface FileDto {
  fileName: string
  fileContent: string
  fileType: MessageDataType
  fileUrl?: string
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
  messageJobs: ILastShowTableData[]
}

export interface ILastShowTableData extends IMessageJobBase {
  title: string
  content?: string
  toUsers: string
  enterprise: {
    id: string
    corpName: string
  }
  app: {
    id: string
    name: string
    appId: string
  }
}

export interface ISendRecordDto extends IMessageJobRecordSame {
  sendTheObject: string
  errorSendtheobject: string
  state: string
}

export interface SendTypeCustomListDto {
  title: string
  value: MessageJobType
}

export interface TimeZoneCustomListDto {
  title: string
  value: TimeType
}

export enum ClickType {
  Collapse,
  Select,
}

export interface SendObject {
  toUsers: string[]
  toParties: string[]
}
