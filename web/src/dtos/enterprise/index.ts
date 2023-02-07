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
  User
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
  Text
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

export interface ISendMsgData {
  appId?: string
  chatId?: string
  toTags?: string[]
  toUsers?: string[]
  toParties?: string[]
  text?: {
    content: string
  }
  file?: {
    fileName: string
    fileContent: string
    fileType: MessageDataType
  }
  mpNews?: {
    articles: [
      {
        content: string
        fileContent: string
      }
    ]
  }
}

export enum ClickType {
  Collapse,
  Select
}
