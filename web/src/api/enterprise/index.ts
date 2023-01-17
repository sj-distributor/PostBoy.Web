import {
  ICorpData,
  ICorpAppListApiData,
  ICorpAppData,
  IDepartmentListApiData,
  IDepartmentUsersListApiData,
  IDepartmentResponse,
  IDepartmentUsersResonse
} from "../../dtos/enterprise";
import { CombineParams, Get, Post } from "../http-client";

export const GetcCorpsList = async () => {
  return await Get<ICorpData[]>("/api/WeChat/work/corps");
};

export const GetCorpAppList = async (params: ICorpAppListApiData) => {
  return await Get<ICorpAppData[]>(
    `/api/WeChat/work/corp/apps?${CombineParams(params)}`
  );
};

export const GetDepartmentList = async (params: IDepartmentListApiData) => {
  return await Get<IDepartmentResponse>(
    `/api/WeChat/work/departments?${CombineParams(params)}`
  );
};

export const GetDepartmentUsersList = async (
  params: IDepartmentUsersListApiData
) => {
  return await Get<IDepartmentUsersResonse>(
    `/api/WeChat/work/department/users?${CombineParams(params)}`
  );
};
