export interface IResponseMsg {
  errcode: number;
  errmsg: string;
}
export interface ICorpData {
  corpId: string;
  corpName: string;
  id: string;
}

export interface ICorpAppData {
  agentId: number;
  appId: string;
  id: string;
  name: string;
  secret: string;
  workWeChatCorpId: string;
}

export interface ICorpAppListApiData {
  CorpId: string;
}

export interface IDepartmentListApiData {
  Id?: number;
  AppId: string;
}

export interface IDepartmentUsersListApiData {
  DepartmentId: number;
  AppId: string;
}

export interface IDepartmentData {
  department_leader: [];
  id: number;
  name: string;
  name_en: null;
  order: number;
  parentid: number;
  departmentUserList: IDepartmentUsersData[];
  selected: boolean;
}

export interface IDepartmentUsersData {
  name: string;
  userid: string;
  department: number[];
  open_userid: string;
  selected: boolean;
}

export interface IDepartmentAndUserListValue {
  id: number | string;
  name: string;
  type?: DepartmentAndUserType;
  parentid: number | string;
}

export enum DepartmentAndUserType {
  Department,
  User
}

export interface IDepartmentResponse extends IResponseMsg {
  department: IDepartmentData[];
}

export interface IDepartmentUsersResonse extends IResponseMsg {
  userlist: IDepartmentUsersData[];
}

export interface IMessageTypeData {
  title: string;
  groupBy: string;
  type: MessageDataType;
}

export enum MessageDataType {
  Image,
  Voice,
  Video,
  File,
  Text
}

export interface ITargetDialogProps {
  open: boolean;
  departmentList: IDepartmentData[];
  flattenDepartmentList: IDepartmentAndUserListValue[];
  AppId: string;
  isLoading: boolean;
  tagsList: ITagsList[];
  setOpenFunction: (open: boolean) => void;
  getDialogValue: (data: ITargetDialogValue) => void;
}

export interface ITargetDialogValue {
  deptAndUserValueList: IDepartmentData[];
  tagsValue: ITagsList;
}

export enum MessageWidgetShowStatus {
  ShowInput,
  ShowUpload,
  ShowAll
}

export interface ITagsListResponse extends IResponseMsg {
  taglist: ITagsList[];
}

export interface ITagsList {
  tagId: number;
  tagName: string;
}
