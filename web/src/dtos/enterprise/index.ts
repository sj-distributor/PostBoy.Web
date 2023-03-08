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
  type: DepartmentAndUserType
  parentid: string | number[]
  selected: boolean
  isCollapsed?: boolean
  children: IDepartmentAndUserListValue[]
}

export enum DepartmentAndUserType {
  Department,
  User
}

export interface IDepartmentResponse extends IResponseMsg {
  department: IDepartmentData[]
}

export interface IDepartmentUsersResonse extends IResponseMsg {
  userlist: IDepartmentUsersData[]
}

export interface ICreateGroupResonse extends IResponseMsg {
  chatid: string
}

export interface IMessageTypeData {
  title: string
  groupBy: string
  type: MessageDataFileType
}

export enum MessageDataFileType {
  Image,
  Voice,
  Video,
  File,
  Text
}

export interface FileObject {
  fileContent?: string
  fileName: string
  fileType: MessageDataFileType
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
  lastTagsValue?: string[] | undefined
  clickName: string
  groupList: IWorkCorpAppGroup[]
  canSelect: DeptUserCanSelectStatus
  groupDeptUserSelectedList?: IDepartmentAndUserListValue[]
  chatId: string
  sendType?: SendObjOrGroup
  setSendType?: React.Dispatch<React.SetStateAction<SendObjOrGroup>>
  setIsRefresh: React.Dispatch<React.SetStateAction<boolean>>
  setChatId?: React.Dispatch<React.SetStateAction<string>>
  setOpenFunction: (open: boolean) => void
  setGroupList: React.Dispatch<React.SetStateAction<IWorkCorpAppGroup[]>>
  setOuterTagsValue: React.Dispatch<React.SetStateAction<ITagsList[]>>
  setDeptUserList: React.Dispatch<React.SetStateAction<IDepartmentKeyControl[]>>
}

export enum DeptUserCanSelectStatus {
  Department,
  User,
  Both
}

export interface ITargetDialogValue {
  deptAndUserValueList: IDepartmentData[]
  tagsValue: ITagsList[]
}

export enum MessageWidgetShowStatus {
  ShowInput,
  ShowUpload,
  ShowAll
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
  isDelete: boolean
  jobType: MessageJobSendType
  jobSettingJson: string
  jobCronExpressionDesc: string
  destination: MessageJobDestination
  workWeChatAppNotification: IWorkWeChatAppNotificationDto
  metadata: {
    id: string
    createDate: string
    messageJobId: string
    key: string
    value: string
  }[]
}

export enum MessageJobSendType {
  Fire,
  Delayed,
  Recurring
}

export enum MessageJobDestination {
  Email,
  WorkWeChat
}

export interface IMessageJobRecord extends IMessageJobRecordSame {
  responseJson: string
  target: string
  exception: string
}

export interface IMessageJobRecordSame {
  id: string
  createdDate: string
  correlationId: string
  result: MessageSendResult
}

export enum MessageSendResult {
  Ok,
  Failed
}

export const messageSendResultType = {
  [MessageSendResult.Ok]: "已发送",
  [MessageSendResult.Failed]: "异常"
}

export interface ISendMessageCommand {
  correlationId?: string
  jobSetting?: IJobSettingDto
  metadata?: { key: string; value: string }[]
  emailNotification?: {
    senderId: string
    subject: string
    body: string
    to: string[]
    cc: string[]
  }
  workWeChatAppNotification?: IWorkWeChatAppNotificationDto
}

export interface IUpdateMessageCommand {
  messageJobId: string
  jobSetting: IJobSettingDto
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
  timezone: string
  delayedJob?: {
    enqueueAt: string
  }
  recurringJob?: {
    cronExpression: string
    endDate?: string
  }
}

export interface IWorkWeChatAppNotificationDto
  extends SendParameter,
    SendData {}

export interface SendParameter {
  appId: string
  chatId?: string
  toTags?: string[]
  toUsers?: string[]
  toParties?: string[]
}

export interface SendData {
  text?: TextDto
  file?: FileObject
  mpNews?: {
    articles: PictureText[]
  }
}

export interface TextDto {
  content: string
}

export enum TimeType {
  UTC,
  America
}

export interface IDtoExtend {
  loading: boolean
  rowCount: number
  pageSize: number
  page: number
  messageJobs: ILastShowTableData[]
}

export interface ILastShowTableData extends IMessageJob {
  title: string
  content?: string
  sendType: string
  groupName?: string
  groupId?: string
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

export interface ILastShowTableEmailData {
  title: string
  content?: string
  sendType: string
  createdDate: string
  correlationId: string
}

export interface ISendRecordDto extends IMessageJobRecordSame {
  sendTheObject: string
  errorSendtheobject: string
  state: string
}

export interface SendTypeCustomListDto {
  title: string
  value: MessageJobSendType
}

export interface TimeZoneCustomListDto {
  title: string
  value: TimeType
}

export enum ClickType {
  Collapse,
  Select
}

export interface SendObject {
  toUsers: string[]
  toParties: string[]
}

export interface PictureText {
  title: string
  content: string
  fileContent?: string
  fileName: string
  contentSourceUrl?: string
  fileUrl?: string
}

export const messageJobSendType = {
  [MessageJobSendType.Fire]: "即时发送",
  [MessageJobSendType.Delayed]: "定时发送",
  [MessageJobSendType.Recurring]: "周期发送"
}

export interface IWorkGroupCreate {
  appId: string
  name: string
  owner?: string
  chatId?: string
  userList: string[]
}

export interface IWorkCorpAppGroup {
  chatId: string
  chatName: string
}

export interface IGetDeptAndUsersResponse {
  workWeChatUnits: IDeptAndUserList[]
}

export interface IDeptAndUserList {
  department: IDepartmentData
  users: IDepartmentUsersData[]
}

export enum SendObjOrGroup {
  Object,
  Group
}

export interface AttachmentUploadReturnData {
  id: string
  createdDate: string
  fileUrl: string
  fileName: string
  fileSize: number
  filePath: string
}
