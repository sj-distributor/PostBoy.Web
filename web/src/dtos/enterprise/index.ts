import React from "react";

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
  type: DepartmentAndUserType;
  parentid: number;
}

export enum DepartmentAndUserType {
  Department,
  User
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
  AppId: string;
  isLoading: boolean;
  setOpenFunction: (open: boolean) => void;
  getDialogValue: (data: ITargetDialogValue) => void;
}

export interface ITargetDialogValue {
  deptAndUserValueList: IDepartmentData[];
  tagsValue: string;
}

export enum MessageWidgetShowStatus {
  ShowInput,
  ShowUpload,
  ShowAll
}
