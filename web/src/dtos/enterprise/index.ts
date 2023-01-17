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
}

export interface IDepartmentListData extends IDepartmentData {
  departmentUserList: IDepartmentUsersData[];
  isCollapse: boolean;
}

export interface IDepartmentResponse {
  errcode: number;
  errmsg: string;
  department: IDepartmentData[];
}

export interface IDepartmentUsersResonse {
  errcode: number;
  errmsg: string;
  userlist: IDepartmentUsersData[];
}

export interface IDepartmentUsersData {
  name: string;
  userid: string;
  department: number[];
  open_userid: string;
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
  setDialogValue: ITargetDialogValue;
  AppId: string;
  setOpenFunction: (open: boolean) => void;
  getDialogValue: (data: ITargetDialogValue) => void;
}

export interface ITargetDialogValue {
  departmentUserValue: IDepartmentUsersData | undefined;
  tagsValue: string;
}

export enum MessageWidgetShowStatus {
  ShowInput,
  ShowUpload,
  ShowAll
}
